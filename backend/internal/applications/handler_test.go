package applications

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

func TestValidateCreateAcceptsWishlistWithoutDate(t *testing.T) {
	input, message := validateCreate(createRequest{
		Company:  "  Fieldnote  ",
		Position: "Product Designer",
		Location: "Chiang Mai",
		WorkType: "remote",
		Status:   "wishlist",
	})
	if message != "" {
		t.Fatal(message)
	}
	if input.Company != "Fieldnote" {
		t.Fatalf("company = %q", input.Company)
	}
	if input.AppliedOn != nil {
		t.Fatal("wishlist date should be empty")
	}
}

func TestValidateCreateRequiresDateUnlessWishlist(t *testing.T) {
	_, message := validateCreate(createRequest{
		Company:  "Acme",
		Position: "Designer",
		Location: "Bangkok",
		WorkType: "onsite",
		Status:   "applied",
	})
	if message != "appliedOn is required unless status is wishlist." {
		t.Fatalf("message = %q", message)
	}
}

func TestDecodeCreateRejectsUserID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	request := httptest.NewRequest(http.MethodPost, "/api/applications", strings.NewReader(`{
		"userId": "43d83852-7116-48bd-ab2e-de85d874f7e9",
		"company": "Acme"
	}`))
	recorder := httptest.NewRecorder()
	context, _ := gin.CreateTestContext(recorder)
	context.Request = request

	_, err := decodeCreate(context)
	if err == nil || err.Error() != "userId must not be in the request body." {
		t.Fatalf("error = %v", err)
	}
}

func TestGetRejectsInvalidID(t *testing.T) {
	recorder := getApplication(t, "not-a-uuid", fakeStore{})

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", recorder.Code, recorder.Body.String())
	}
}

func TestGetReturnsNotFoundWhenDatabaseHasNoRow(t *testing.T) {
	recorder := getApplication(t, "4dd4c16c-0ba9-423d-8765-76306c2c82c5", fakeStore{
		get: func(context.Context, uuid.UUID, uuid.UUID) (Application, error) {
			return Application{}, fmt.Errorf("scan application: %w", pgx.ErrNoRows)
		},
	})

	if recorder.Code != http.StatusNotFound {
		t.Fatalf("status = %d, body = %s", recorder.Code, recorder.Body.String())
	}
}

func TestGetReturnsTheApplicationForTheCurrentUser(t *testing.T) {
	userID := uuid.MustParse("43d83852-7116-48bd-ab2e-de85d874f7e9")
	applicationID := uuid.MustParse("4dd4c16c-0ba9-423d-8765-76306c2c82c5")
	var gotUserID uuid.UUID
	var gotID uuid.UUID

	recorder := getApplication(t, applicationID.String(), fakeStore{
		get: func(_ context.Context, userID uuid.UUID, id uuid.UUID) (Application, error) {
			gotUserID = userID
			gotID = id
			return Application{
				ID:       id.String(),
				Company:  "Acme",
				Position: "Product Designer",
				Location: "Chiang Mai",
				WorkType: "hybrid",
				Status:   "wishlist",
			}, nil
		},
	})

	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d, body = %s", recorder.Code, recorder.Body.String())
	}
	if gotUserID != userID || gotID != applicationID {
		t.Fatalf("query user = %s, id = %s", gotUserID, gotID)
	}

	var body map[string]any
	if err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if _, ok := body["userId"]; ok {
		t.Fatal("response includes userId")
	}
	if body["company"] != "Acme" {
		t.Fatalf("company = %v", body["company"])
	}
}

func getApplication(t *testing.T, id string, store applicationStore) *httptest.ResponseRecorder {
	t.Helper()
	gin.SetMode(gin.TestMode)

	handler := &Handler{
		store:  store,
		userID: uuid.MustParse("43d83852-7116-48bd-ab2e-de85d874f7e9"),
	}
	router := gin.New()
	router.GET("/api/applications/:id", handler.Get)

	request := httptest.NewRequest(http.MethodGet, "/api/applications/"+id, nil)
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, request)
	return recorder
}

type fakeStore struct {
	get func(ctx context.Context, userID uuid.UUID, id uuid.UUID) (Application, error)
}

func (fake fakeStore) List(context.Context, uuid.UUID) ([]Application, error) {
	return nil, nil
}

func (fake fakeStore) Get(ctx context.Context, userID uuid.UUID, id uuid.UUID) (Application, error) {
	return fake.get(ctx, userID, id)
}

func (fake fakeStore) Create(context.Context, uuid.UUID, CreateInput) (Application, error) {
	return Application{}, nil
}
