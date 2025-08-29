import { cloneElement } from 'react'
import type { ControlAriaProps, FormFieldProps } from '../types/ui'

export function FormField<P extends ControlAriaProps = ControlAriaProps>({
  id,
  label,
  labelHidden,
  error,
  hint,
  required,
  className,
  controlClassName,
  labelAction,
  children,
}: FormFieldProps<P>) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  // narrow helpers
  const isStr = (v: unknown): v is string => typeof v === 'string' && v.length > 0

  // child props (typed as P)
  const childProps = children.props as P
  const existingDescribedBy = isStr(childProps['aria-describedby'])
    ? childProps['aria-describedby']
    : undefined
  const existingClass = isStr(childProps.className) ? childProps.className : undefined
  const controlId = isStr(childProps.id) ? childProps.id! : id

  // aria-describedby: merge existing + hint + error
  const describedBy =
    [existingDescribedBy, hint ? hintId : undefined, error ? errorId : undefined]
      .filter(isStr)
      .join(' ') || undefined

  // className merge
  const mergedControlClass =
    [existingClass, controlClassName].filter(isStr).join(' ') || undefined

  // only patch what’s needed
  const patch: Partial<P> = {
    ...(controlId ? ({ id: controlId } as Partial<P>) : null),
    ...(mergedControlClass ? ({ className: mergedControlClass } as Partial<P>) : null),
    ...(describedBy ? ({ 'aria-describedby': describedBy } as Partial<P>) : null),
    ...(error ? ({ 'aria-invalid': true } as Partial<P>) : null),
    ...(required ? ({ required: true, 'aria-required': true } as Partial<P>) : null),
  } as Partial<P>

  const cloned = cloneElement(children, patch)

  return (
    <div className={`mb-3 ${className ?? ''}`}>
      <div className="d-flex align-items-center justify-content-between mb-1">
        <label
          htmlFor={controlId}
          className={`form-label mb-0 ${labelHidden ? 'visually-hidden' : ''}`}
        >
          {label}
          {required && <span className="text-danger ms-1" title="Required">*</span>}
        </label>
        {labelAction ? <div className="ms-2">{labelAction}</div> : null}
      </div>

      {cloned}

      {hint && !error && (
        <div id={hintId} className="form-text">
          {hint}
        </div>
      )}
      {error && (
        <div id={errorId} className="text-danger small mt-1">
          {error}
        </div>
      )}
    </div>
  )
}

export default FormField
