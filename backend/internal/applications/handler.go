package applications

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

const maxRequestBytes = 1 << 20

type Handler struct {
	store  *Store
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
