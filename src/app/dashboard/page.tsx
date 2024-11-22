import { prisma } from '../../lib/prisma';
import SubmissionHistory from '@/components/SubmissionHistory';
import UploadForm from '@/components/UploadForm';

export default async function Dashboard() {
  // Fetch submissions directly (or initialize empty data)
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Essay Grading Dashboard</h1>
        <UploadForm />
        <SubmissionHistory submissions={submissions} />
      </div>
    </div>
  );
}
