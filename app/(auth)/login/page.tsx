"use client" // Required if using hooks like useAuth or client-side form handling

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login-form" // Assuming LoginForm handles the actual submission

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Welcome to ComplexCare CRM
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{" "}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full">
                  Enter Demo Mode (Bypass Login)
                </Button>
              </Link>
              <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                Demo mode provides access without authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
