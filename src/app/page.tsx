import Link from 'next/link';

export default async function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Essay Grading System</h1>
        <Link
          href="/dashboard"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 block text-center"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
