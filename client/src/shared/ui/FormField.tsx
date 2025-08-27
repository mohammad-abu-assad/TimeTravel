import { ReactElement } from 'react'

type FormFieldProps = {
  id: string
  label: string
  error?: string
  className?: string
  children: ReactElement
}

export function FormField({ id, label, error, className, children }: FormFieldProps) {
  const errorId = `${id}-error`
  return (
    <div className={`mb-2 ${className ?? ''}`}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      {React.cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && (
        <div id={errorId} className="text-danger small">
          {error}
        </div>
      )}
    </div>
  )
}

export default FormField
