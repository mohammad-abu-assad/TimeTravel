import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegister } from '../hooks'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../shared/auth/AuthProvider'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
})
type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const { register: fregister, handleSubmit, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })
  const mutation = useRegister()

  const onSubmit = async (data: FormValues) => {
    const res = await mutation.mutateAsync(data)
    await login(res.data.access_token)
    navigate('/')
  }

  return (
    <div className="col-md-5 mx-auto">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        <label className="form-label">Email</label>
        <input className="form-control mb-2" placeholder="you@example.com" {...fregister('email')} />
        {errors.email && <div className="text-danger small">{errors.email.message}</div>}

        <label className="form-label mt-2">Password</label>
        <div className="input-group mb-2">
          <input
            className="form-control"
            type={show ? 'text' : 'password'}
            placeholder="••••••••"
            {...fregister('password')}
          />
          <button type="button" className="btn btn-outline-secondary" onClick={() => setShow(s => !s)}>
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <div className="text-danger small">{errors.password.message}</div>}

        <button className="btn btn-primary mt-3" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating…' : 'Sign up'}
        </button>
      </form>

      {mutation.isError && <div className="alert alert-danger mt-3">{(mutation.error as Error).message}</div>}

      <div className="mt-3">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  )
}
