create table applications (
    id uuid primary key default gen_random_uuid(),
    -- References users(id) after authentication exists. There is no users table yet.
    user_id uuid not null,
    company text not null,
    position text not null,
    job_description text not null default '',
    job_url text not null default '',
    location text not null,
    work_type text not null,
    status text not null,
    applied_on date,
    notes text not null default '',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint applications_company_length check (char_length(btrim(company)) between 1 and 120),
    constraint applications_position_length check (char_length(btrim(position)) between 1 and 120),
    constraint applications_location_length check (char_length(btrim(location)) between 1 and 120),
    constraint applications_job_description_length check (char_length(job_description) <= 5000),
    constraint applications_notes_length check (char_length(notes) <= 2000),
    constraint applications_work_type_check check (work_type in ('onsite', 'hybrid', 'remote')),
    constraint applications_status_check check (status in ('wishlist', 'applied', 'interview', 'offer', 'rejected')),
    constraint applications_applied_on_check check (status = 'wishlist' or applied_on is not null)
);

create index applications_user_id_idx on applications (user_id);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger applications_set_updated_at
before update on applications
for each row
execute function set_updated_at();
