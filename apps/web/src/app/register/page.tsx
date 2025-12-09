"use client";

import { useState, FormEvent } from "react";
import { useRegisterMutation } from "@/store/authApi";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/i18n/config";
import { getAuthMessages } from "@/i18n/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [register, { isLoading, error }] = useRegisterMutation();

  const t = getAuthMessages(defaultLocale);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await register({ email, password }).unwrap();
      if (res.data) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Register error", err);
    }
  }

  const apiError = (error as any)?.data?.error?.message ?? null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-md border border-gray-300 bg-white p-6 shadow-sm text-gray-700"
      >
        <h1 className="text-xl font-semibold">{t.registerTitle}</h1>

        <div className="space-y-1">
          <label className="block text-sm font-medium">
            {t.registerEmailLabel}
          </label>
          <input
            type="email"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">
            {t.registerPasswordLabel}
          </label>
          <input
            type="password"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {apiError && <p className="text-sm text-red-600">{apiError}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        <p className="text-xs text-gray-500">
          {t.registerHaveAccount}{" "}
          <a href="/login" className="underline">
            {t.registerHaveAccountLink}
          </a>
        </p>
      </form>
    </div>
  );
}
