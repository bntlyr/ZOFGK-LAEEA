import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function analyzeEssay(essayText: string, webinarContent: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    Analyze this essay against the provided webinar content.
    Essay: ${essayText}
    Webinar Content: ${webinarContent}
    
    Provide a detailed analysis in the following format:
    1. Content Accuracy (score out of 100):
    [Evaluate how well the essay content matches the webinar material]

    2. Understanding of Key Concepts (score out of 100):
    [Assess comprehension of main ideas and concepts]

    3. Writing Quality (score out of 100):
    [Evaluate structure, clarity, and coherence]

    4. Areas for Improvement:
    [List specific points for enhancement]

    5. Overall Grade (A/B/C/D/F):
    [Calculate based on average of scores]
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}