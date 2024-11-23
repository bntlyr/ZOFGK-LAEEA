'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import mammoth from 'mammoth'

export default function UploadForm() {
  const [essay, setEssay] = useState<File | null>(null)
  const [essayContent, setEssayContent] = useState<string>('')
  const [webinarContent, setWebinarContent] = useState<File | null>(null)
  const [webinarTextContent, setWebinarTextContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState<string>('')

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.name.endsWith('.docx')) {
        // Handle .docx files
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            try {
              // Convert ArrayBuffer to Buffer for mammoth
              const arrayBuffer = event.target.result as ArrayBuffer;
              const result = await mammoth.extractRawText({ arrayBuffer });
              resolve(result.value);
            } catch (err) {
              reject(new Error('Failed to read .docx file'));
            }
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
      } else {
        // Handle .txt files
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as string);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      }
    });
  };

  const onEssayDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setEssay(file)
    try {
      const content = await readFileContent(file)
      console.log('Extracted essay content:', content.substring(0, 100) + '...') // Debug log
      setEssayContent(content)
      setError('')
    } catch (err) {
      setError('Failed to read essay file. Please try again.')
      console.error('Error reading essay:', err)
    }
  }, [])

  const onWebinarDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setWebinarContent(file)
    try {
      const content = await readFileContent(file)
      console.log('Extracted webinar content:', content.substring(0, 100) + '...') // Debug log
      setWebinarTextContent(content)
      setError('')
    } catch (err) {
      setError('Failed to read webinar content file. Please try again.')
      console.error('Error reading webinar content:', err)
    }
  }, [])

  const { getRootProps: getEssayRootProps, getInputProps: getEssayInputProps } = useDropzone({
    onDrop: onEssayDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  const { getRootProps: getWebinarRootProps, getInputProps: getWebinarInputProps } = useDropzone({
    onDrop: onWebinarDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!essayContent || !webinarTextContent) {
      setError('Please upload both essay and webinar content files.')
      return
    }

    setLoading(true)
    setError('')
    
    const formData = new FormData()
    formData.append('essay', essayContent)
    formData.append('webinarContent', webinarTextContent)

    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setFeedback(data.feedback)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to process files. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Upload Essay</h2>
          <div
            {...getEssayRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <input {...getEssayInputProps()} />
            <p>{essay ? essay.name : 'Drag and drop your essay (.txt or .docx), or click to select'}</p>
          </div>
          {essayContent && (
            <div className="mt-2">
              <div className="text-sm text-green-600">✓ Essay content loaded successfully</div>
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Preview:</strong><br/>
                {essayContent.substring(0, 100)}...
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Upload Webinar Content</h2>
          <div
            {...getWebinarRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <input {...getWebinarInputProps()} />
            <p>{webinarContent ? webinarContent.name : 'Drag and drop webinar content (.txt or .docx), or click to select'}</p>
          </div>
          {webinarTextContent && (
            <div className="mt-2">
              <div className="text-sm text-green-600">✓ Webinar content loaded successfully</div>
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Preview:</strong><br/>
                {webinarTextContent.substring(0, 100)}...
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!essayContent || !webinarTextContent || loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
    </div>
  )
}