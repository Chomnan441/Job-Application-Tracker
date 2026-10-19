package applications

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const applicationColumns = `
	id::text,
	company,
	position,
	job_description,
	job_url,
	location,
	work_type,
	status,
	applied_on::text,
	notes,
	created_at,
	updated_at
`

type Store struct {
	pool *pgxpool.Pool
}

func NewStore(pool *pgxpool.Pool) *Store {
	return &Store{pool: pool}
}

func (store *Store) List(ctx context.Context, userID uuid.UUID) ([]Application, error) {
	rows, err := store.pool.Query(ctx, `
		select `+applicationColumns+`
		from applications
		where user_id = $1::uuid
		order by created_at desc
	`, userID.String())
	if err != nil {
		return nil, fmt.Errorf("list applications: %w", err)
	}
	defer rows.Close()

	applications := make([]Application, 0)
	for rows.Next() {
		application, err := scanApplication(rows)
		if err != nil {
			return nil, err
		}
		applications = append(applications, application)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("list applications: %w", err)
	}

	return applications, nil
}

func (store *Store) Get(ctx context.Context, userID uuid.UUID, id uuid.UUID) (Application, error) {
	row := store.pool.QueryRow(ctx, `
		select `+applicationColumns+`
		from applications
		where id = $1::uuid
		and user_id = $2::uuid
	`, id.String(), userID.String())

	application, err := scanApplication(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Application{}, err
		}
		return Application{}, fmt.Errorf("get application: %w", err)
	}

	return application, nil
}

func (store *Store) Create(ctx context.Context, userID uuid.UUID, input CreateInput) (Application, error) {
	var appliedOn any
	if input.AppliedOn != nil {
		appliedOn = *input.AppliedOn
	}

	row := store.pool.QueryRow(ctx, `
		insert into applications (
			user_id,
			company,
			position,
			job_description,
			job_url,
			location,
			work_type,
			status,
			applied_on,
			notes
		) values (
			$1::uuid, $2, $3, $4, $5, $6, $7, $8, $9::date, $10
		)
		returning `+applicationColumns+`
	`,
		userID.String(),
		input.Company,
		input.Position,
		input.JobDescription,
		input.JobURL,
		input.Location,
		input.WorkType,
		input.Status,
		appliedOn,
		input.Notes,
	)

	application, err := scanApplication(row)
	if err != nil {
		return Application{}, fmt.Errorf("create application: %w", err)
	}

	return application, nil
}

func scanApplication(row pgx.Row) (Application, error) {
	var application Application
	var createdAt time.Time
	var updatedAt time.Time

	err := row.Scan(
		&application.ID,
		&application.Company,
		&application.Position,
		&application.JobDescription,
		&application.JobURL,
		&application.Location,
		&application.WorkType,
		&application.Status,
		&application.AppliedOn,
		&application.Notes,
		&createdAt,
		&updatedAt,
	)
	if err != nil {
		return Application{}, fmt.Errorf("scan application: %w", err)
	}

	application.CreatedAt = createdAt.UTC().Format(time.RFC3339)
	application.UpdatedAt = updatedAt.UTC().Format(time.RFC3339)
	return application, nil
}
