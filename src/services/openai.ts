import OpenAI from "openai";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
if (!API_KEY) {
  throw new Error("OpenAI API key is not configured");
}

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true, //  should use a backend server in production
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const summarizeText = async (text: string): Promise<string> => {
  const maxLength = 2000;
  const inputText = text.length > maxLength ? text.slice(0, maxLength) : text;

  const makeRequest = async (tries = 0): Promise<string> => {
    try {
      console.log("Sending request to OpenAI...");

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a concise summarizer. Summarize the following article in 2-3 clear, informative sentences:",
          },
          {
            role: "user",
            content: inputText,
          },
        ],
        temperature: 0.5,
        max_tokens: 250,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const summary = response.choices[0].message.content;

      if (!summary) {
        throw new Error("No summary generated");
      }

      console.log("Summary generated successfully");
      return summary;
    } catch (error: any) {
      if (error.message && error.message.includes("Rate limit")) {
        const maxRetries = 5;
        if (tries < maxRetries) {
          const delay = Math.pow(2, tries) * 1000;
          console.warn(`Rate limit reached, retrying in ${delay} ms...`);
          await sleep(delay);
          return makeRequest(tries + 1);
        } else {
          throw new Error("Rate limit reached. Please try again later.");
        }
      }
      console.error("OpenAI API Error:", error);
      throw new Error(`Summarization failed: ${error.message || error}`);
    }
  };

  return makeRequest();
};

export const testOpenAIConnection = async (): Promise<boolean> => {
  try {
    const testResult = await summarizeText(
      "This is a test message to verify the OpenAI API connection is working properly."
    );
    return Boolean(testResult);
  } catch (error) {
    console.error("OpenAI Connection Test Failed:", error);
    return false;
  }
};
