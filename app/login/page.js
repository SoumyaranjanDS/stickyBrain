"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await axios.post("/api/login", form);

      setStatus({
        type: "success",
        message: response.data?.message || "Logged in successfully",
      });

      setForm({
        email: "",
        password: "",
      });

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");

      const destination =
        next && next.startsWith("/") && !next.startsWith("//")
          ? next
          : "/ideas";

      router.replace(destination);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      setStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fffdf5] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size={44} href="/" />
          <h1 className="mt-4 text-2xl font-black text-stone-900">
            Welcome back to Sticky<span className="text-orange-500">Brain</span>
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Log in to pin ideas and join discussions
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-600"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-600"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                type="password"
                onChange={handleChange}
                required
                minLength={6}
                className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-stone-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-stone-900 px-4 py-3 font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>

        {status.message && (
          <div
            className={`mt-4 rounded-xl p-3 text-center text-sm font-medium ${
              status.type === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {status.message}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-stone-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-orange-600 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
