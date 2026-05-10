"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, MapPin, ArrowRight, Loader2, Check } from "lucide-react";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(80).optional(),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpValues = z.infer<typeof signUpSchema>;

const PERKS = [
  "Build detailed day-by-day itineraries",
  "Track budgets in Indian Rupees",
  "Share trips with fellow travelers",
  "Discover activities worldwide",
];

export default function SignUpPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: SignUpValues) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setFormError(payload?.error || "Unable to create your account.");
        return;
      }

      const signInResponse = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/home",
      });

      if (signInResponse?.ok && signInResponse.url) {
        router.push(signInResponse.url);
        return;
      }
      router.push("/auth/signin");
    } catch {
      setFormError("Unable to create your account right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[48%] relative overflow-hidden bg-gray-950">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1400&q=85"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-tl from-orange-900/70 via-black/60 to-black/80" />

        <div className="relative z-10 p-10">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Traveloop</span>
          </Link>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mt-8 max-w-sm">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Why Traveloop?</p>
            <ul className="space-y-4">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-white text-sm font-medium">
                  <div className="w-6 h-6 rounded-full bg-orange-500/30 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10 p-10 pb-16">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 max-w-md">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop"
              alt="User"
              className="w-12 h-12 rounded-full object-cover border-2 border-orange-400 shrink-0"
            />
            <div>
              <p className="text-white font-semibold text-sm">"Planned my entire Europe trip in 20 minutes!"</p>
              <p className="text-white/50 text-xs mt-1">— Arjun R., Mumbai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Traveloop</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Start your journey</h1>
          <p className="text-gray-500 text-sm mb-8">Create your free account and start planning in minutes.</p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700">Full name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Alex Traveler"
                {...register("name")}
                className={`w-full h-12 px-4 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`w-full h-12 px-4 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  {...register("password")}
                  className={`w-full h-12 px-4 pr-12 rounded-xl border text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Error */}
            {formError && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {formError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200 disabled:opacity-60"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              By creating an account you agree to our{" "}
              <span className="text-orange-500 cursor-pointer hover:underline">Terms of Service</span>.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
