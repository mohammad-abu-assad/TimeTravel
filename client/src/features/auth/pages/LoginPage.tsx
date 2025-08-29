// src/features/auth/pages/LoginPage.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../shared/auth/AuthProvider";
import PasswordInput from "../../../shared/ui/PasswordInput.tsx";
import FormField from "../../../shared/ui/FormField";
import { useMemo, useState } from "react";
import AuthLayout from "../../../layouts/AuthLayout"; // ⬅️ NEW

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { remember: true },
  });

  const mutation = useLogin();
  const submitting = mutation.isPending;

  const email = watch("email");
  const greeting = useMemo(() => {
    if (!email) return "Welcome back";
    const handle = email.split("@")[0];
    return `Welcome back${handle ? `, ${handle}` : ""}`;
  }, [email]);

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      const res = await mutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      await login(res.data.access_token);
      navigate("/");
    } catch (e: unknown) {
      if (e instanceof Error) setServerError(e.message);
      else if (typeof e === "string") setServerError(e);
      else setServerError("Unable to sign in. Please try again.");
    }
  };

  return (
    <AuthLayout title={greeting} subtitle="Sign in to continue to TimeTravel">
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
          hint="Use the email you registered with."
        >
          <input
            className="form-control"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            disabled={submitting}
            {...register("email")}
          />
        </FormField>

        <FormField
          id="password"
          label="Password"
          required
          error={errors.password?.message}
          className="mt-2"
          labelAction={
            <Link to="/forgot" className="small text-decoration-none">
              Forgot?
            </Link>
          }
        >
          <PasswordInput
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={submitting}
            invalid={!!errors.password}
            {...register("password")}
          />
        </FormField>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="form-check">
            <input
              id="remember"
              type="checkbox"
              className="form-check-input"
              disabled={submitting}
              {...register("remember")}
            />
            <label htmlFor="remember" className="form-check-label">
              Remember me
            </label>
          </div>
        </div>

        <button
          className="btn btn-primary w-100 mt-4"
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
              Signing in…
            </>
          ) : (
            "Log in"
          )}
        </button>

        <div className="d-flex align-items-center my-4">
          <div className="flex-grow-1 border-top" />
          <span className="small text-muted mx-3">or</span>
          <div className="flex-grow-1 border-top" />
        </div>

        <Link to="/register" className="btn btn-outline-secondary w-100">
          Create an account
        </Link>
      </form>
    </AuthLayout>
  );
}
