import { testOpenAIConnection } from '../services/openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runTest() {
    try {
        console.log('Testing OpenAI API connection...');
        const result = await testOpenAIConnection();
        console.log('Test result:', result ? 'SUCCESS ✅' : 'FAILED ❌');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

runTest();