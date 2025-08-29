import { forwardRef, useId, useState } from 'react'
import type { PasswordInputProps } from '../types/inputs'

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      className,
      controlClassName,
      buttonClassName,
      disabled,
      invalid,
      toggleLabels,
      onRevealChange,
      id: idProp,
      autoComplete,
      ...props
    },
    ref
  ) {
    const reactId = useId()
    const id = idProp ?? `pw-${reactId}`
    const [show, setShow] = useState(false)
    const labels = toggleLabels ?? { show: 'Show', hide: 'Hide' }

    const handleToggle = () => {
      setShow(prev => {
        const next = !prev
        onRevealChange?.(next)
        return next
      })
    }

    const inputClass = [
      'form-control',
      className,
      controlClassName,
      invalid ? 'is-invalid' : undefined,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="input-group">
        <input
          {...props}
          ref={ref}
          id={id}
          type={show ? 'text' : 'password'}
          className={inputClass}
          disabled={disabled}
          autoComplete={autoComplete ?? 'current-password'}
          aria-invalid={invalid || undefined}
        />
        <button
          type="button"
          className={['btn', 'btn-outline-secondary', buttonClassName].filter(Boolean).join(' ')}
          onClick={handleToggle}
          disabled={disabled}
          aria-label={show ? `${labels.hide} password` : `${labels.show} password`}
          aria-pressed={show}
          aria-controls={id}
          title={show ? labels.hide : labels.show}
        >
          {show ? labels.hide : labels.show}
        </button>
      </div>
    )
  }
)

export default PasswordInput
export type { PasswordInputProps }
