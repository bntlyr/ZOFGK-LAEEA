'use client'

import { formatDistanceToNow } from 'date-fns'

type Submission = {
  id: string
  createdAt: Date
  feedback: string | null
}

export default function SubmissionHistory({ submissions }: { submissions: Submission[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Previous Submissions</h2>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
              </span>
            </div>
            {submission.feedback && (
              <p className="text-gray-700 whitespace-pre-wrap">{submission.feedback}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}