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

        // Get the generative model
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash'
        });

        // Generate feedback using Google Generative AI
        const result = await model.generateContent(`
            Essay:
            ${essay}

            Webinar Content:
            ${webinarContent}

            Summarize the content and you need to score it from 0-100% on how relevant the essay is to the webinar content.
            I need you to be honest about your feedback, as it is paramount for the users to know the audience's reception from
            their webinar. You are a analyzing tool that will summarize chunks of responses into a concise matter, and score it 
            based on its relevancy. 
        `);

        // Extract and structure the feedback
        const feedbackText = result.response.text();
        
        // Log the complete feedback for debugging
        console.log('Generated Feedback:', {
            rawFeedback: feedbackText,
            essayLength: essay.length,
            webinarLength: webinarContent.length
        });

        // Save to database if needed
        // const submission = await prisma.submission.create({
        //     data: {
        //         essayText: essay,
        //         webinarText: webinarContent,
        //         feedback: feedbackText,
        //         user: {
        //             connect: { id: userId },
        //         },
        //     },
        // });

        // Return structured response
        return NextResponse.json({
            success: true,
            feedback: feedbackText,
            metadata: {
                essayLength: essay.length,
                webinarLength: webinarContent.length,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        // Enhanced error handling
        console.error('Detailed error:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to process the essay',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}