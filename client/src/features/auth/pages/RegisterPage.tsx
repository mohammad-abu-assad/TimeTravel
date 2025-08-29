// src/features/auth/pages/RegisterPage.tsx
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegister } from '../hooks'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../shared/auth/AuthProvider'
import PasswordInput from '../../../shared/ui/PasswordInput.tsx'

import FormField from '../../../shared/ui/FormField'
import { useState } from 'react'
import AuthLayout from '../../../layouts/AuthLayout' // ⬅️ use the unified auth layout

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
})
type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const mutation = useRegister()
  const submitting = mutation.isPending

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    try {
      const res = await mutation.mutateAsync(data)
      await login(res.data.access_token)
      navigate('/')
    } catch (e: unknown) {
      if (e instanceof Error) setServerError(e.message)
      else setServerError('Unable to create account. Please try again.')
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join TimeTravel today">
      {serverError && (
        <div className="alert alert-danger" role="alert" aria-live="polite">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="email"
          label="Email"
          error={errors.email?.message}
          required
          hint="We’ll never share your email."
        >
          <input
            className="form-control"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={submitting}
            {...formRegister('email')}
          />
        </FormField>

        <FormField
          id="password"
          label="Password"
          error={errors.password?.message}
          required
          className="mt-2"
          hint="At least 6 characters"
        >
          <PasswordInput
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={submitting}
            invalid={!!errors.password}
            {...formRegister('password')}
          />
        </FormField>

        <button
          className="btn btn-success w-100 mt-4"
          disabled={submitting || !isValid}
          aria-busy={submitting}
        >
          {submitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Creating…
            </>
          ) : (
            'Sign up'
          )}
        </button>

        <div className="d-flex align-items-center my-4">
          <div className="flex-grow-1 border-top" />
          <span className="small text-muted mx-3">or</span>
          <div className="flex-grow-1 border-top" />
        </div>

        <Link to="/login" className="btn btn-outline-secondary w-100">
          Already have an account? Log in
        </Link>
      </form>
    </AuthLayout>
  )
}
