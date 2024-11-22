import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { prisma } from '../../lib/prisma'
import SubmissionHistory from '@/components/SubmissionHistory'
import UploadForm from '@/components/UploadForm'
import { authOptions } from '@/server/auth'
export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    include: {
      submissions: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Essay Grading Dashboard</h1>
        <UploadForm />
        <SubmissionHistory submissions={user?.submissions || []} />
      </div>
    </div>
  )
}