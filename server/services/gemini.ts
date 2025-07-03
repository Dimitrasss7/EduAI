import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface EducationalResponse {
  response: string;
  confidence: number;
  subject?: string;
  difficulty?: string;
  suggestions?: string[];
}

export async function generateEducationalResponse(
  userMessage: string,
  context?: { subject?: string; grade?: string; previousMessages?: ChatMessage[] }
): Promise<EducationalResponse> {
  try {
    const systemPrompt = `You are an AI educational assistant for an online learning platform. 
    You help students with homework, explain complex topics, and provide study guidance.
    
    Context:
    - Subject: ${context?.subject || "General"}
    - Grade level: ${context?.grade || "High School"}
    - Previous conversation: ${context?.previousMessages?.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n') || "None"}
    
    Guidelines:
    - Provide clear, educational explanations
    - Ask follow-up questions to ensure understanding
    - Suggest practice problems or study methods
    - Be encouraging and supportive
    - If unsure about a topic, acknowledge limitations
    
    User question: ${userMessage}
    
    Provide a helpful response and rate your confidence (0-1) in the accuracy of your answer.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            response: { type: "string" },
            confidence: { type: "number" },
            subject: { type: "string" },
            difficulty: { type: "string" },
            suggestions: { type: "array", items: { type: "string" } }
          },
          required: ["response", "confidence"],
        },
      },
      contents: userMessage,
    });

    const rawJson = response.text;
    if (rawJson) {
      const data: EducationalResponse = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      response: "I'm having trouble processing your request right now. Please try again or contact support if the issue persists.",
      confidence: 0.1,
      suggestions: ["Try rephrasing your question", "Check your internet connection", "Contact support"]
    };
  }
}

export async function generateQuizQuestions(
  topic: string,
  difficulty: string,
  questionCount: number = 5
): Promise<{ questions: any[], passingScore: number }> {
  try {
    const prompt = `Create ${questionCount} multiple choice questions about ${topic} at ${difficulty} level.
    Each question should have 4 options with only one correct answer.
    Include explanations for correct answers.
    
    Format as JSON with this structure:
    {
      "questions": [
        {
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correct": 0,
          "explanation": "Why this answer is correct"
        }
      ],
      "passingScore": 70
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correct: { type: "number" },
                  explanation: { type: "string" }
                },
                required: ["question", "options", "correct", "explanation"]
              }
            },
            passingScore: { type: "number" }
          },
          required: ["questions", "passingScore"]
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Quiz generation error:", error);
    return {
      questions: [],
      passingScore: 70
    };
  }
}

export async function analyzeStudentProgress(
  completedLessons: number,
  totalLessons: number,
  quizScores: number[],
  timeSpent: number
): Promise<{
  progressAnalysis: string;
  recommendations: string[];
  predictedScore: number;
}> {
  try {
    const prompt = `Analyze a student's learning progress and provide insights:
    
    Progress Data:
    - Completed lessons: ${completedLessons}/${totalLessons}
    - Quiz scores: ${quizScores.join(", ")}
    - Time spent studying: ${timeSpent} hours
    
    Provide analysis, recommendations, and predict their final exam score (0-100).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            progressAnalysis: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
            predictedScore: { type: "number" }
          },
          required: ["progressAnalysis", "recommendations", "predictedScore"]
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Progress analysis error:", error);
    return {
      progressAnalysis: "Unable to analyze progress at this time.",
      recommendations: ["Continue studying regularly", "Review completed lessons", "Practice with quizzes"],
      predictedScore: 75
    };
  }
}
