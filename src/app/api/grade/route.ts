import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../../../lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        // Parse form data from the request
        const formData = await req.formData();
        const essay = formData.get('essay')?.toString() || '';
        const webinarContent = formData.get('webinarContent')?.toString() || '';

        // Validate that both fields are present
        if (!essay || !webinarContent) {
            return NextResponse.json(
                { error: 'Both essay and webinar content are required.' },
                { status: 400 }
            );
        }

        // Generate feedback using Google Generative AI
        const response = await genAI.generateText({
            model: 'gemini-1.5-pro',
            prompt: `
                Essay:
                ${essay}

                Provide feedback based on:
                1. Understanding of core concepts
                2. Alignment with webinar content
                3. Critical analysis
                4. Writing quality
                5. Suggested improvements
            `,
        });

        const feedback = response.data.text || 'No feedback generated.';

        // Assuming a valid user ID for submission
        const userId = 'some-user-id'; // Replace with actual user ID.

        // Save submission to the database using Prisma
        const submission = await prisma.submission.create({
            data: {
                essayText: essay,
                webinarText: webinarContent,
                feedback,
                user: {
                    connect: { id: userId },
                },
            },
        });

        // Return feedback and submission ID
        return NextResponse.json({ feedback, submissionId: submission.id });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: 'Failed to process the essay.' },
            { status: 500 }
        );
    }
}
