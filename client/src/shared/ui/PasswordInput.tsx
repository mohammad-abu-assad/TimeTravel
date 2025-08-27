import { forwardRef, InputHTMLAttributes, useState } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

const PasswordInput = forwardRef<HTMLInputElement, Props>(function PasswordInput(
  { className, disabled, ...props },
  ref
) {
  const [show, setShow] = useState(false)
  return (
    <div className="input-group">
      <input
        {...props}
        ref={ref}
        type={show ? 'text' : 'password'}
        className={`form-control ${className ?? ''}`}
        disabled={disabled}
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => setShow((s) => !s)}
        disabled={disabled}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  )
})

export default PasswordInput
