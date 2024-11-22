import { getServerSession } from 'next-auth/next'
import Link from 'next/link'
import { authOptions } from '@/server/auth'
export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {!session ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8">Essay Grading System</h1>
            <Link
              href="/auth/signin"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Sign In with Google
            </Link>
          </div>
        ) : (
          <Link
            href="/dashboard"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Go to Dashboard
          </Link>
        )}
      </div>
    </main>
  )
}