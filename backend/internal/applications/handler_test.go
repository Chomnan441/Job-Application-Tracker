package applications

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
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
