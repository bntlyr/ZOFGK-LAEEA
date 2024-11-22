interface GradingCriteria {
  contentAccuracy: number;
  conceptUnderstanding: number;
  writingQuality: number;
}

export function analyzeEssay(essayText: string, webinarContent: string): {
  analysis: string;
  grade: string;
  criteria: GradingCriteria;
} {
  // Simple keyword matching and analysis
  const essayWords = new Set(essayText.toLowerCase().split(/\s+/));
  const webinarWords = new Set(webinarContent.toLowerCase().split(/\s+/));
  
  // Calculate content accuracy
  const matchingWords = [...essayWords].filter(word => webinarWords.has(word));
  const contentAccuracy = (matchingWords.length / webinarWords.size) * 100;
  
  // Analyze writing quality (basic metrics)
  const sentences = essayText.split(/[.!?]+/).filter(Boolean);
  const avgSentenceLength = essayText.split(/\s+/).length / sentences.length;
  const writingQuality = avgSentenceLength > 10 && avgSentenceLength < 25 ? 85 : 70;
  
  // Calculate concept understanding
  const conceptUnderstanding = contentAccuracy * 0.8;
  
  // Calculate final grade
  const overallScore = (contentAccuracy + conceptUnderstanding + writingQuality) / 3;
  const grade = overallScore >= 90 ? 'A' :
                overallScore >= 80 ? 'B' :
                overallScore >= 70 ? 'C' :
                overallScore >= 60 ? 'D' : 'F';

  const analysis = `
Analysis Results:
1. Content Accuracy (${contentAccuracy.toFixed(1)}%): ${
    contentAccuracy > 80 ? 'Excellent match with webinar content' :
    contentAccuracy > 60 ? 'Good coverage of webinar material' :
    'Limited alignment with webinar content'
  }

2. Understanding of Key Concepts (${conceptUnderstanding.toFixed(1)}%): ${
    conceptUnderstanding > 80 ? 'Strong grasp of core concepts' :
    conceptUnderstanding > 60 ? 'Adequate understanding shown' :
    'Need to improve concept understanding'
  }

3. Writing Quality (${writingQuality}%): ${
    writingQuality > 80 ? 'Well-structured and clear' :
    writingQuality > 60 ? 'Generally clear but could improve' :
    'Needs improvement in structure and clarity'
  }

4. Areas for Improvement:
${contentAccuracy < 80 ? '- Review webinar content more thoroughly\n' : ''}
${conceptUnderstanding < 80 ? '- Focus on understanding key concepts\n' : ''}
${writingQuality < 80 ? '- Work on sentence structure and clarity\n' : ''}

5. Overall Grade: ${grade}
`;

  return {
    analysis,
    grade,
    criteria: {
      contentAccuracy,
      conceptUnderstanding,
      writingQuality
    }
  };
}