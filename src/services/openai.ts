import OpenAI from 'openai';
import dotenv from 'dotenv';


const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
if (!API_KEY) {
  throw new Error('OpenAI API key is not configured');
}

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend server
});

export const summarizeText = async (text: string): Promise<string> => {
  try {
    if (!text || text.length < 10) {
      throw new Error('Text is too short to summarize');
    }

    console.log('Sending request to OpenAI...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a concise summarizer. Summarize the following article in 2-3 clear, informative sentences:"
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.5,
      max_tokens: 150,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const summary = response.choices[0].message.content;
    
    if (!summary) {
      throw new Error('No summary generated');
    }

    console.log('Summary generated successfully');
    return summary;

  } catch (error) {
    console.error('OpenAI API Error:', error);
    if (error instanceof Error) {
      throw new Error(`Summarization failed: ${error.message}`);
    }
    throw new Error('Failed to generate summary');
  }
};

// Add a test function to verify API connection
export const testOpenAIConnection = async (): Promise<boolean> => {
  try {
    const testResult = await summarizeText(
      "This is a test message to verify the OpenAI API connection is working properly."
    );
    return Boolean(testResult);
  } catch (error) {
    console.error('OpenAI Connection Test Failed:', error);
    return false;
  }
};