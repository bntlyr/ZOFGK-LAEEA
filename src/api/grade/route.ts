import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getServerSession } from 'next-auth'
import { prisma } from '../../../lib/prisma'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

async function extractText(file: File) {
  const text = await file.text()
  return text
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const essay = formData.get('essay') as File
    const webinarContent = formData.get('webinarContent') as File

    const essayText = await extractText(essay)
    const webinarText = await extractText(webinarContent)

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
      Analyze this essay against the provided webinar content.
      
      Webinar Content:
      ${webinarText}
      
      Essay:
      ${essayText}
      
      Provide feedback based on:
      1. Understanding of core concepts
      2. Alignment with webinar content
      3. Critical analysis
      4. Writing quality
      5. Suggested improvements
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const feedback = response.text()

    // Get or create user
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name || '',
      },
    })

    // Save submission
    const submission = await prisma.submission.create({
      data: {
        essayText,
        webinarText,
        feedback,
        userId: user.id,
      },
    })

    return NextResponse.json({ feedback, submissionId: submission.id })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Failed to process the essay' },
      { status: 500 }
    )
  }
}