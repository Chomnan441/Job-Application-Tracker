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
