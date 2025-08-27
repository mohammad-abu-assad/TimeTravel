import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegister } from '../hooks'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../shared/auth/AuthProvider'
import PasswordInput from '../../../shared/ui/PasswordInput'
import FormField from '../../../shared/ui/FormField'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
})
type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register: formRegister, handleSubmit, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })
  const mutation = useRegister()

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await mutation.mutateAsync(data)
      await login(res.data.access_token)
      navigate('/')
    } catch {
      // error handled centrally
    }
  }

  return (
    <div className="col-md-5 mx-auto">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        <FormField id="email" label="Email" error={errors.email?.message}>
          <input
            className="form-control"
            placeholder="you@example.com"
            disabled={mutation.isPending}
            {...formRegister('email')}
          />
        </FormField>

        <FormField id="password" label="Password" error={errors.password?.message} className="mt-2">
          <PasswordInput
            placeholder="••••••••"
            disabled={mutation.isPending}
            {...formRegister('password')}
          />
        </FormField>

        <button className="btn btn-primary mt-3" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating…' : 'Sign up'}
        </button>
      </form>

      <div className="mt-3">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  )
}
