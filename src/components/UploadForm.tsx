'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadForm() {
  const [essay, setEssay] = useState<File | null>(null)
  const [webinarContent, setWebinarContent] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const onEssayDrop = useCallback((acceptedFiles: File[]) => {
    setEssay(acceptedFiles[0])
  }, [])

  const onWebinarDrop = useCallback((acceptedFiles: File[]) => {
    setWebinarContent(acceptedFiles[0])
  }, [])

  const { getRootProps: getEssayRootProps, getInputProps: getEssayInputProps } = useDropzone({
    onDrop: onEssayDrop,
    accept: {
      'application/vnd.google-apps.document': ['.gdoc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  const { getRootProps: getWebinarRootProps, getInputProps: getWebinarInputProps } = useDropzone({
    onDrop: onWebinarDrop,
    accept: {
      'application/vnd.google-apps.presentation': ['.gslides'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.google-apps.document': ['.gdoc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!essay || !webinarContent) return

    setLoading(true)
    const formData = new FormData()
    formData.append('essay', essay)
    formData.append('webinarContent', webinarContent)

    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setFeedback(data.feedback)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Upload Essay</h2>
        <div
          {...getEssayRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
        >
          <input {...getEssayInputProps()} />
          <p>{essay ? essay.name : 'Drag and drop your essay, or click to select'}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Upload Webinar Content</h2>
        <div
          {...getWebinarRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
        >
          <input {...getWebinarInputProps()} />
          <p>{webinarContent ? webinarContent.name : 'Drag and drop webinar content, or click to select'}</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!essay || !webinarContent || loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Grade Essay'}
      </button>

      {feedback && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Feedback:</h3>
          <p className="whitespace-pre-wrap">{feedback}</p>
        </div>
      )}
    </form>
  )
}