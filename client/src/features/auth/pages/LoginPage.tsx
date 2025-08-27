import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '../hooks'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../shared/auth/AuthProvider'


const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })
  const mutation = useLogin()

  const onSubmit = async (data: FormValues) => {
    const res = await mutation.mutateAsync(data)
    await login(res.data.access_token)
    navigate('/')
  }

  return (
    <div className="col-md-5 mx-auto">
      <h2>Log in</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        <label className="form-label">Email</label>
        <input className="form-control mb-2" placeholder="you@example.com" {...register('email')} />
        {errors.email && <div className="text-danger small">{errors.email.message}</div>}

        <label className="form-label mt-2">Password</label>
        <div className="input-group mb-2">
          <input
            className="form-control"
            type={show ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password')}
          />
          <button type="button" className="btn btn-outline-secondary" onClick={() => setShow(s => !s)}>
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <div className="text-danger small">{errors.password.message}</div>}

        <button className="btn btn-primary mt-3" disabled={mutation.isPending}>
          {mutation.isPending ? 'Signing in…' : 'Log in'}
        </button>
      </form>

      {mutation.isError && <div className="alert alert-danger mt-3">{(mutation.error as Error).message}</div>}

      <div className="mt-3">
        New here? <Link to="/register">Create an account</Link>
      </div>
    </div>
  )
}
