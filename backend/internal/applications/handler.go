package applications

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const maxRequestBytes = 1 << 20

type applicationStore interface {
	List(ctx context.Context, userID uuid.UUID) ([]Application, error)
	Get(ctx context.Context, userID uuid.UUID, id uuid.UUID) (Application, error)
	Update(ctx context.Context, userID uuid.UUID, id uuid.UUID, patch Patch) (Application, error)
	Create(ctx context.Context, userID uuid.UUID, input CreateInput) (Application, error)
}

type Handler struct {
	store  applicationStore
	userID uuid.UUID
}

type createRequest struct {
	Company        string  `json:"company"`
	Position       string  `json:"position"`
	JobDescription string  `json:"jobDescription"`
	JobURL         string  `json:"jobUrl"`
	Location       string  `json:"location"`
	WorkType       string  `json:"workType"`
	Status         string  `json:"status"`
	AppliedOn      *string `json:"appliedOn"`
	Notes          string  `json:"notes"`
}

func NewHandler(pool *pgxpool.Pool, userID uuid.UUID) *Handler {
	return &Handler{
		store:  NewStore(pool),
		userID: userID,
	}
}

func (handler *Handler) List(c *gin.Context) {
	applications, err := handler.store.List(c.Request.Context(), handler.userID)
	if err != nil {
		log.Printf("list applications: %v", err)
		writeError(c, http.StatusInternalServerError, "Could not load applications.")
		return
	}

	c.JSON(http.StatusOK, applications)
}

func (handler *Handler) Get(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		writeError(c, http.StatusBadRequest, "Application id must be a valid UUID.")
		return
	}

	application, err := handler.store.Get(c.Request.Context(), handler.userID, id)
	if errors.Is(err, pgx.ErrNoRows) {
		writeError(c, http.StatusNotFound, "Application not found.")
		return
	}
	if err != nil {
		log.Printf("get application: %v", err)
		writeError(c, http.StatusInternalServerError, "Could not load the application.")
		return
	}

	c.JSON(http.StatusOK, application)
}

func (handler *Handler) Patch(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		writeError(c, http.StatusBadRequest, "Application id must be a valid UUID.")
		return
	}

	patch, err := decodePatch(c)
	if err != nil {
		writeError(c, http.StatusBadRequest, err.Error())
		return
	}

	current, err := handler.store.Get(c.Request.Context(), handler.userID, id)
	if errors.Is(err, pgx.ErrNoRows) {
		writeError(c, http.StatusNotFound, "Application not found.")
		return
	}
	if err != nil {
		log.Printf("get application: %v", err)
		writeError(c, http.StatusInternalServerError, "Could not load the application.")
		return
	}

	validated, message := validateCreate(mergePatch(current, patch))
	if message != "" {
		writeError(c, http.StatusBadRequest, message)
		return
	}
	if patch.empty() {
		c.JSON(http.StatusOK, current)
		return
	}

	updated, err := handler.store.Update(c.Request.Context(), handler.userID, id, applyValidated(patch, validated))
	if errors.Is(err, pgx.ErrNoRows) {
		writeError(c, http.StatusNotFound, "Application not found.")
		return
	}
	if err != nil {
		log.Printf("update application: %v", err)
		writeError(c, http.StatusInternalServerError, "Could not update the application.")
		return
	}

	c.JSON(http.StatusOK, updated)
}

func (handler *Handler) Create(c *gin.Context) {
	request, err := decodeCreate(c)
	if err != nil {
		writeError(c, http.StatusBadRequest, err.Error())
		return
	}

	input, message := validateCreate(request)
	if message != "" {
		writeError(c, http.StatusBadRequest, message)
		return
	}

	application, err := handler.store.Create(c.Request.Context(), handler.userID, input)
	if err != nil {
		log.Printf("create application: %v", err)
		writeError(c, http.StatusInternalServerError, "Could not save the application.")
		return
	}

	c.JSON(http.StatusCreated, application)
}

func decodeCreate(c *gin.Context) (createRequest, error) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxRequestBytes)
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		return createRequest{}, errInvalid("Request body must be JSON.")
	}

	var fields map[string]json.RawMessage
	if err := json.Unmarshal(body, &fields); err != nil {
		return createRequest{}, errInvalid("Request body must be a JSON object.")
	}

	if _, ok := fields["userId"]; ok {
		return createRequest{}, errInvalid("userId must not be in the request body.")
	}
	if _, ok := fields["user_id"]; ok {
		return createRequest{}, errInvalid("userId must not be in the request body.")
	}

	var request createRequest
	if err := json.Unmarshal(body, &request); err != nil {
		return createRequest{}, errInvalid("Request body must be a JSON object with text fields.")
	}

	return request, nil
}

func validateCreate(request createRequest) (CreateInput, string) {
	company := strings.TrimSpace(request.Company)
	position := strings.TrimSpace(request.Position)
	location := strings.TrimSpace(request.Location)
	jobDescription := request.JobDescription
	jobURL := strings.TrimSpace(request.JobURL)
	notes := request.Notes
	workType := request.WorkType
	status := request.Status
	appliedOn := normalizeDate(request.AppliedOn)

	if company == "" {
		return CreateInput{}, "Enter a company name."
	}
	if utf8.RuneCountInString(company) > 120 {
		return CreateInput{}, "Company must be 120 characters or fewer."
	}
	if position == "" {
		return CreateInput{}, "Enter a position."
	}
	if utf8.RuneCountInString(position) > 120 {
		return CreateInput{}, "Position must be 120 characters or fewer."
	}
	if location == "" {
		return CreateInput{}, "Enter a location."
	}
	if utf8.RuneCountInString(location) > 120 {
		return CreateInput{}, "Location must be 120 characters or fewer."
	}
	if utf8.RuneCountInString(jobDescription) > 5000 {
		return CreateInput{}, "Job description must be 5000 characters or fewer."
	}
	if utf8.RuneCountInString(notes) > 2000 {
		return CreateInput{}, "Notes must be 2000 characters or fewer."
	}
	if workType != "onsite" && workType != "hybrid" && workType != "remote" {
		return CreateInput{}, "workType must be onsite, hybrid, or remote."
	}
	if status != "wishlist" && status != "applied" && status != "interview" && status != "offer" && status != "rejected" {
		return CreateInput{}, "status must be wishlist, applied, interview, offer, or rejected."
	}
	if appliedOn != nil {
		if _, err := time.Parse("2006-01-02", *appliedOn); err != nil {
			return CreateInput{}, "appliedOn must be a date in YYYY-MM-DD format."
		}
	}
	if status != "wishlist" && appliedOn == nil {
		return CreateInput{}, "appliedOn is required unless status is wishlist."
	}

	return CreateInput{
		Company:        company,
		Position:       position,
		JobDescription: jobDescription,
		JobURL:         jobURL,
		Location:       location,
		WorkType:       workType,
		Status:         status,
		AppliedOn:      appliedOn,
		Notes:          notes,
	}, ""
}

func decodePatch(c *gin.Context) (Patch, error) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxRequestBytes)
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		return Patch{}, errInvalid("Request body must be a JSON object.")
	}

	var fields map[string]json.RawMessage
	if err := json.Unmarshal(body, &fields); err != nil || fields == nil {
		return Patch{}, errInvalid("Request body must be a JSON object.")
	}
	if _, ok := fields["userId"]; ok {
		return Patch{}, errInvalid("userId must not be in the request body.")
	}
	if _, ok := fields["user_id"]; ok {
		return Patch{}, errInvalid("userId must not be in the request body.")
	}

	var patch Patch
	for key, raw := range fields {
		switch key {
		case "company":
			patch.Company, err = patchText(raw)
		case "position":
			patch.Position, err = patchText(raw)
		case "jobDescription":
			patch.JobDescription, err = patchText(raw)
		case "jobUrl":
			patch.JobURL, err = patchText(raw)
		case "location":
			patch.Location, err = patchText(raw)
		case "workType":
			patch.WorkType, err = patchText(raw)
		case "status":
			patch.Status, err = patchText(raw)
		case "notes":
			patch.Notes, err = patchText(raw)
		case "appliedOn":
			patch.AppliedOnSet = true
			value, valueErr := decodePatchString(raw)
			if valueErr != nil {
				return Patch{}, errInvalid("appliedOn must be a string or null.")
			}
			patch.AppliedOn = normalizeDate(value)
		default:
			return Patch{}, errInvalid("Unknown field " + key + ".")
		}
		if err != nil {
			return Patch{}, errInvalid(key + " must be a string or null.")
		}
	}

	return patch, nil
}

func patchText(raw json.RawMessage) (*string, error) {
	value, err := decodePatchString(raw)
	if err != nil {
		return nil, err
	}
	if value == nil {
		empty := ""
		return &empty, nil
	}
	return value, nil
}

func decodePatchString(raw json.RawMessage) (*string, error) {
	if string(raw) == "null" {
		return nil, nil
	}

	var value string
	if err := json.Unmarshal(raw, &value); err != nil {
		return nil, err
	}
	return &value, nil
}

func mergePatch(current Application, patch Patch) createRequest {
	merged := createRequest{
		Company:        current.Company,
		Position:       current.Position,
		JobDescription: current.JobDescription,
		JobURL:         current.JobURL,
		Location:       current.Location,
		WorkType:       current.WorkType,
		Status:         current.Status,
		AppliedOn:      current.AppliedOn,
		Notes:          current.Notes,
	}
	if patch.Company != nil {
		merged.Company = *patch.Company
	}
	if patch.Position != nil {
		merged.Position = *patch.Position
	}
	if patch.JobDescription != nil {
		merged.JobDescription = *patch.JobDescription
	}
	if patch.JobURL != nil {
		merged.JobURL = *patch.JobURL
	}
	if patch.Location != nil {
		merged.Location = *patch.Location
	}
	if patch.WorkType != nil {
		merged.WorkType = *patch.WorkType
	}
	if patch.Status != nil {
		merged.Status = *patch.Status
	}
	if patch.AppliedOnSet {
		merged.AppliedOn = patch.AppliedOn
	}
	if patch.Notes != nil {
		merged.Notes = *patch.Notes
	}
	return merged
}

func applyValidated(patch Patch, validated CreateInput) Patch {
	if patch.Company != nil {
		company := validated.Company
		patch.Company = &company
	}
	if patch.Position != nil {
		position := validated.Position
		patch.Position = &position
	}
	if patch.JobDescription != nil {
		jobDescription := validated.JobDescription
		patch.JobDescription = &jobDescription
	}
	if patch.JobURL != nil {
		jobURL := validated.JobURL
		patch.JobURL = &jobURL
	}
	if patch.Location != nil {
		location := validated.Location
		patch.Location = &location
	}
	if patch.WorkType != nil {
		workType := validated.WorkType
		patch.WorkType = &workType
	}
	if patch.Status != nil {
		status := validated.Status
		patch.Status = &status
	}
	if patch.AppliedOnSet {
		patch.AppliedOn = validated.AppliedOn
	}
	if patch.Notes != nil {
		notes := validated.Notes
		patch.Notes = &notes
	}
	return patch
}

func normalizeDate(value *string) *string {
	if value == nil {
		return nil
	}

	trimmed := strings.TrimSpace(*value)
	if trimmed == "" {
		return nil
	}

	return &trimmed
}

type errInvalid string

func (err errInvalid) Error() string {
	return string(err)
}

func writeError(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"error": message})
}
