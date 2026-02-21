import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";

import api from "../api/axiosClient";

const schema = yup
  .object({
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
      .string()
      .required("Please confirm password")
      .oneOf([yup.ref("password")], "Passwords do not match"),
  })
  .required();

export default function ResetPasswordPage() {
  const passwordId = useId();
  const confirmPasswordId = useId();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = (searchParams.get("token") || "").trim();

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    const validateToken = async () => {
      if (!token) {
        if (!isMounted) return;
        setServerError("");
        setIsTokenValid(false);
        setIsCheckingToken(false);
        navigate("/login", {
          replace: true,
          state: { bannerMessage: "Invalid or expired reset link. Please request a new one." },
        });
        return;
      }

      try {
        await api.get("/auth/reset-password/validate", {
          params: { token },
        });
        if (!isMounted) return;
        setIsTokenValid(true);
        setServerError("");
      } catch (err) {
        if (!isMounted) return;
        setIsTokenValid(false);
        setServerError("");
        navigate("/login", {
          replace: true,
          state: {
            bannerMessage:
              (typeof err.response?.data === "string" && err.response.data) ||
              "Invalid or expired reset link. Please request a new one.",
          },
        });
      } finally {
        if (isMounted) setIsCheckingToken(false);
      }
    };

    validateToken();
    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  const onSubmit = async (values) => {
    setServerError("");
    setSuccessMessage("");

    if (!token || !isTokenValid) {
      setServerError("Reset token is missing. Please use the link from your email.");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: values.password,
      });
      setSuccessMessage("Password reset successful. Redirecting to login in 3 seconds...");
      setTimeout(() => navigate("/login", { replace: true }), 3000);
    } catch (err) {
      setServerError(err.response?.data || "Unable to reset password. Try again.");
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-[100dvh] flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="w-full h-40 sm:h-48 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden shrink-0 bg-[linear-gradient(135deg,#0F172A_0%,#1E293B_100%)]">
          <div
            className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <span className="material-icons-round text-white text-2xl">
                  key
                </span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Fleet-Flow
              </span>
            </div>
            <h1 className="text-white text-lg font-medium opacity-90">
              Reset your password
            </h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-4 sm:px-6 -mt-6 relative z-20">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md mx-auto rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 sm:p-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Set New Password
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Enter and confirm your new password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {isCheckingToken && (
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Validating reset link...
                </p>
              )}
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  htmlFor={passwordId}
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="material-icons-round text-slate-400 text-xl">
                      lock_open
                    </span>
                  </div>
              <input
                    id={passwordId}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="block w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                    placeholder="••••••••"
                    disabled={!!successMessage}
                    readOnly={!isTokenValid || isCheckingToken}
                    {...register("password")}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={!!successMessage}
                  >
                    <span className="material-icons-round text-slate-400 hover:text-slate-600 text-xl">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
                {errors.password?.message && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  htmlFor={confirmPasswordId}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="material-icons-round text-slate-400 text-xl">
                      lock
                    </span>
                  </div>
                  <input
                    id={confirmPasswordId}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="block w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                    placeholder="••••••••"
                    disabled={!!successMessage}
                    readOnly={!isTokenValid || isCheckingToken}
                    {...register("confirmPassword")}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    disabled={!!successMessage}
                  >
                    <span className="material-icons-round text-slate-400 hover:text-slate-600 text-xl">
                      {showConfirmPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
                {errors.confirmPassword?.message && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {serverError && (
                <p className="text-red-500 text-sm font-medium">{serverError}</p>
              )}
              {successMessage && (
                <p className="text-green-600 text-sm font-medium">{successMessage}</p>
              )}

              <button
                className="w-full bg-primary hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-slate-200 dark:shadow-none transition-all active:scale-[0.98] mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting || !!successMessage || !isTokenValid || isCheckingToken}
              >
                {isSubmitting
                  ? "Resetting..."
                  : successMessage
                    ? "Password Updated"
                    : "Reset Password"}
              </button>
            </form>

            <div className="mt-6 text-center">
              {successMessage ? (
                <button
                  type="button"
                  className="text-secondary font-semibold hover:underline text-sm"
                  onClick={() => navigate("/login", { replace: true })}
                >
                  Go to Login now
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-secondary font-semibold hover:underline text-sm"
                >
                  Back to Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
