"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { APP_NAME } from "@/lib/config";

export default function RegisterPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    general?: string;
  }>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    // Reset errors
    setErrors({});

    // Validate all fields first
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = "Email is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    if (!name) {
      newErrors.name = "Name is required";
    }

    // If there are validation errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to signin page after successful registration
      router.push("/signin");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error instanceof Error ? error.message : "Registration failed",
      }));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center relative">
      <Link
        href="/"
        className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <div className="w-full max-w-md space-y-8 px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Register for {APP_NAME}</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to get started
          </p>
        </div>
        {errors.general && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        )}
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Full Name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Register
            </Button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
