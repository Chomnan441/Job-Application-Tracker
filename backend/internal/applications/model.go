package applications

type Application struct {
	ID             string  `json:"id"`
	Company        string  `json:"company"`
	Position       string  `json:"position"`
	JobDescription string  `json:"jobDescription"`
	JobURL         string  `json:"jobUrl"`
	Location       string  `json:"location"`
	WorkType       string  `json:"workType"`
	Status         string  `json:"status"`
	AppliedOn      *string `json:"appliedOn"`
	Notes          string  `json:"notes"`
	CreatedAt      string  `json:"createdAt"`
	UpdatedAt      string  `json:"updatedAt"`
}

type CreateInput struct {
	Company        string
	Position       string
	JobDescription string
	JobURL         string
	Location       string
	WorkType       string
	Status         string
	AppliedOn      *string
	Notes          string
}

// Patch carries only the fields included in a PATCH body.
// A nil text field was not sent. AppliedOnSet reports whether appliedOn was sent,
// including when the client explicitly sent null.
type Patch struct {
	Company        *string
	Position       *string
	JobDescription *string
	JobURL         *string
	Location       *string
	WorkType       *string
	Status         *string
	AppliedOn      *string
	AppliedOnSet   bool
	Notes          *string
}

func (patch Patch) empty() bool {
	return patch.Company == nil &&
		patch.Position == nil &&
		patch.JobDescription == nil &&
		patch.JobURL == nil &&
		patch.Location == nil &&
		patch.WorkType == nil &&
		patch.Status == nil &&
		!patch.AppliedOnSet &&
		patch.Notes == nil
}
