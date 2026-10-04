import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { applicationStatusLabels } from "@/components/applications/application-status-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  applicationFormSchema,
  toJobApplication,
  workTypeLabels,
} from "@/lib/application-form"
import {
  applicationStatuses,
  workTypes,
  type ApplicationFormData,
  type JobApplication,
} from "@/lib/types"

const emptyForm = {
  company: "",
  position: "",
  jobDescription: "",
  jobUrl: "",
  location: "",
  workType: "",
  status: "",
  appliedOn: "",
  notes: "",
}

type AddApplicationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (application: JobApplication) => void
}

type ChoiceFieldProps = {
  id: string
  label: string
  placeholder: string
  value: string
  invalid: boolean
  error?: { message?: string }
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

function ChoiceField({
  id,
  label,
  placeholder,
  value,
  invalid,
  error,
  options,
  onChange,
}: ChoiceFieldProps) {
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>
        {label}
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
        <span className="sr-only">required</span>
      </FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : undefined}
          className="w-full bg-card"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="bottom"
          align="start"
          sideOffset={4}
          avoidCollisions={false}
          className="z-[60]"
        >
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {invalid ? <FieldError id={`${id}-error`} errors={[error]} /> : null}
    </Field>
  )
}

export function AddApplicationDialog({
  open,
  onOpenChange,
  onCreate,
}: AddApplicationDialogProps) {
  const form = useForm({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: emptyForm,
  })

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset(emptyForm)
    }
    onOpenChange(nextOpen)
  }

  function handleSubmit(data: ApplicationFormData) {
    const application = toJobApplication(data)
    console.log(data)
    onCreate(application)
    form.reset(emptyForm)
    onOpenChange(false)
  }

  const status = form.watch("status")
  const appliedDateRequired = status !== "" && status !== "wishlist"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[min(42rem,calc(100dvh-2rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="px-4 pt-4 pr-12">
          <DialogTitle>Add application</DialogTitle>
          <DialogDescription>
            Save a role you want to track. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex min-h-0 flex-1 flex-col"
          noValidate
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <FieldSet>
              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <Controller
                  name="company"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="company">
                        Company name
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                        <span className="sr-only">required</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="company"
                        autoComplete="organization"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.invalid ? "company-error" : undefined
                        }
                        placeholder="Northwind Labs"
                        className="bg-card"
                      />
                      {fieldState.invalid ? (
                        <FieldError id="company-error" errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
                <Controller
                  name="position"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="position">
                        Position
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                        <span className="sr-only">required</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="position"
                        autoComplete="organization-title"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.invalid ? "position-error" : undefined
                        }
                        placeholder="Frontend Engineer"
                        className="bg-card"
                      />
                      {fieldState.invalid ? (
                        <FieldError id="position-error" errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
                <div className="sm:col-span-2">
                  <Controller
                    name="jobDescription"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="job-description">
                          Job description
                          <span className="font-normal text-muted-foreground">
                            (Optional)
                          </span>
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="job-description"
                          rows={4}
                          aria-invalid={fieldState.invalid}
                          aria-describedby={
                            fieldState.invalid ? "job-description-error" : undefined
                          }
                          placeholder="Paste the role summary"
                          className="min-h-24 bg-card"
                        />
                        {fieldState.invalid ? (
                          <FieldError
                            id="job-description-error"
                            errors={[fieldState.error]}
                          />
                        ) : null}
                      </Field>
                    )}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Controller
                    name="jobUrl"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="job-url">Job URL</FieldLabel>
                        <Input
                          {...field}
                          id="job-url"
                          type="url"
                          inputMode="url"
                          autoComplete="url"
                          aria-invalid={fieldState.invalid}
                          aria-describedby={
                            fieldState.invalid ? "job-url-error" : "job-url-hint"
                          }
                          placeholder="https://"
                          className="bg-card"
                        />
                        {fieldState.invalid ? (
                          <FieldError id="job-url-error" errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription id="job-url-hint">
                            Optional. Include https://.
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="location"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="location">
                        Location
                        <span className="text-destructive" aria-hidden="true">
                          *
                        </span>
                        <span className="sr-only">required</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="location"
                        autoComplete="address-level2"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.invalid ? "location-error" : undefined
                        }
                        placeholder="Bangkok"
                        className="bg-card"
                      />
                      {fieldState.invalid ? (
                        <FieldError id="location-error" errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
                <Controller
                  name="workType"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <ChoiceField
                      id="work-type"
                      label="Work type"
                      placeholder="Select a work type"
                      value={field.value}
                      invalid={fieldState.invalid}
                      error={fieldState.error}
                      onChange={field.onChange}
                      options={workTypes.map((item) => ({
                        value: item,
                        label: workTypeLabels[item],
                      }))}
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <ChoiceField
                      id="application-status"
                      label="Status"
                      placeholder="Select a status"
                      value={field.value}
                      invalid={fieldState.invalid}
                      error={fieldState.error}
                      onChange={field.onChange}
                      options={applicationStatuses.map((item) => ({
                        value: item,
                        label: applicationStatusLabels[item],
                      }))}
                    />
                  )}
                />
                <Controller
                  name="appliedOn"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="applied-date">
                        Applied date
                        {appliedDateRequired ? (
                          <>
                            <span className="text-destructive" aria-hidden="true">
                              *
                            </span>
                            <span className="sr-only">required</span>
                          </>
                        ) : null}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="applied-date"
                        type="date"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.invalid ? "applied-date-error" : "applied-date-hint"
                        }
                        className="bg-card"
                      />
                      {fieldState.invalid ? (
                        <FieldError
                          id="applied-date-error"
                          errors={[fieldState.error]}
                        />
                      ) : (
                        <FieldDescription id="applied-date-hint">
                          Required unless the status is Wishlist.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <div className="sm:col-span-2">
                  <Controller
                    name="notes"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="notes">
                          Notes
                          <span className="font-normal text-muted-foreground">
                            (Optional)
                          </span>
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="notes"
                          rows={3}
                          aria-invalid={fieldState.invalid}
                          aria-describedby={
                            fieldState.invalid ? "notes-error" : undefined
                          }
                          placeholder="Recruiter name, follow-up, or anything else"
                          className="min-h-20 bg-card"
                        />
                        {fieldState.invalid ? (
                          <FieldError id="notes-error" errors={[fieldState.error]} />
                        ) : null}
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </FieldSet>
          </div>
          <DialogFooter className="mx-0 mb-0">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Save application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
