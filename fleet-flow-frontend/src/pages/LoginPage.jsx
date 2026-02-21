import { yupResolver } from "@hookform/resolvers/yup";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const schema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  })
  .required();

export default function LoginPage() {
  const emailId = useId();
  const passwordId = useId();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setServerError("");

    const result = await login(values.email, values.password);
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setServerError(result.error || "Invalid email or password");
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-[max(884px,100dvh)] flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="w-full h-48 sm:h-64 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden shrink-0 bg-[linear-gradient(135deg,#0F172A_0%,#1E293B_100%)]">
          <div
            className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <span className="material-icons-round text-white text-2xl">
                  local_shipping
                </span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Fleet-Flow
              </span>
            </div>
            <h1 className="text-white text-lg font-medium opacity-90">
              Modular Fleet &amp; Logistics Management
            </h1>
            <p className="text-blue-200/60 text-xs mt-1">
              Efficiency in motion.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-6 -mt-8 relative z-20">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md mx-auto rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Sign In
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Welcome back to the dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  htmlFor={emailId}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="material-icons-round text-slate-400 text-xl">
                      mail_outline
                    </span>
                  </div>
                  <input
                    id={emailId}
                    type="email"
                    autoComplete="email"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                    placeholder="name@company.com"
                    {...register("email")}
                  />
                </div>
                {errors.email?.message && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    htmlFor={passwordId}
                  >
                    Password
                  </label>
                  <a
                    className="text-xs font-semibold text-secondary hover:text-blue-600 dark:text-blue-400"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    Forgot Password?
                  </a>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="material-icons-round text-slate-400 text-xl">
                      lock_open
                    </span>
                  </div>
                  <input
                    id={passwordId}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="block w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

              {serverError && (
                <p className="text-red-500 text-sm font-medium">
                  {serverError}
                </p>
              )}

              <button
                className="w-full bg-primary hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-slate-200 dark:shadow-none transition-all active:scale-[0.98] mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login to Dashboard"}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Don&apos;t have an account?{" "}
                <a
                  className="text-secondary font-semibold hover:underline"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Register Fleet
                </a>
              </p>
            </div>
          </div>

          <div className="mt-auto py-8 text-center">
            <div className="flex justify-center space-x-6 text-xs font-medium text-slate-400 dark:text-slate-600">
              <a
                className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Privacy Policy
              </a>
              <a
                className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Terms of Service
              </a>
              <a
                className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
