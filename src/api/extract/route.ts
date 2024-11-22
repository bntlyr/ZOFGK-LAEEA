import { NextResponse } from 'next/server';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

const client = new DocumentProcessorServiceClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    const [result] = await client.processDocument({
      name: process.env.DOCUMENTAI_PROCESSOR_NAME,
      rawDocument: {
        content: buffer,
        mimeType: file.type,
      },
    });

    const { document } = result;
    const text = document?.text || '';

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error extracting text:', error);
    return NextResponse.json(
      { error: 'Failed to extract text' },
      { status: 500 }
    );
  }
}