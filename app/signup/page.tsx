import SignupForm from "@/components/signup-form"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <BookOpen className="h-12 w-auto text-primary" />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-heading">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-muted">
            Or{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
