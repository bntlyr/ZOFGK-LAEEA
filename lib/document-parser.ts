import * as PDFJS from 'pdfjs-dist';

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

export async function extractText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  
  if (file.type === 'application/pdf') {
    return extractPdfText(arrayBuffer);
  } else if (file.type.includes('text')) {
    return new TextDecoder().decode(arrayBuffer);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or text file.');
  }
}

async function extractPdfText(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(' ') + '\n';
  }
  
  return text;
}