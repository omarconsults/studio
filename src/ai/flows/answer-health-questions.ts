'use server';
/**
 * @fileOverview A health question answering AI agent.
 *
 * - answerHealthQuestions - A function that handles answering health questions.
 * - AnswerHealthQuestionsInput - The input type for the answerHealthQuestions function.
 * - AnswerHealthQuestionsOutput - The return type for the answerHealthQuestions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import { GenkitError } from 'genkit'; // Import GenkitError

const AnswerHealthQuestionsInputSchema = z.object({
  question: z.string().describe('The health question to be answered.'),
});
export type AnswerHealthQuestionsInput = z.infer<typeof AnswerHealthQuestionsInputSchema>;

const AnswerHealthQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the health question.'),
});
export type AnswerHealthQuestionsOutput = z.infer<typeof AnswerHealthQuestionsOutputSchema>;

export async function answerHealthQuestions(input: AnswerHealthQuestionsInput): Promise<AnswerHealthQuestionsOutput> {
  return answerHealthQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerHealthQuestionsPrompt',
  input: {
    schema: z.object({
      question: z.string().describe('The health question to be answered.'),
    }),
  },
  output: {
    schema: z.object({
      answer: z.string().describe('The answer to the health question.'),
    }),
  },
  prompt: `You are a helpful AI assistant providing health information to Africans with limited access to healthcare resources. Please answer the following question accurately and in a way that is easy to understand. Focus on providing information relevant to the African context, and avoid making assumptions about the availability of advanced medical treatments. Use simple, clear language.

**Important Formatting Note:** When presenting information in lists, please use hyphens (-) at the beginning of each list item. Do not use asterisks (*).

Question: {{{question}}}`,
});

const answerHealthQuestionsFlow = ai.defineFlow<
  typeof AnswerHealthQuestionsInputSchema,
  typeof AnswerHealthQuestionsOutputSchema
>(
  {
    name: 'answerHealthQuestionsFlow',
    inputSchema: AnswerHealthQuestionsInputSchema,
    outputSchema: AnswerHealthQuestionsOutputSchema,
  },
  async (input): Promise<AnswerHealthQuestionsOutput> => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        // Handle cases where the prompt might return undefined output
        console.error('AI prompt returned undefined output for question:', input.question);
        return { answer: "Sorry, I couldn't generate an answer for that question. Please try again." };
      }
      return output;
    } catch (err) {
      console.error('Error in answerHealthQuestionsFlow:', err);
      if (err instanceof GenkitError && err.status === 'FAILED_PRECONDITION') {
        // Handle content blocking or other precondition failures gracefully
        return { answer: "I am unable to answer this question due to content restrictions or safety guidelines. Please try rephrasing or asking a different health-related question." };
      }
      // Handle other types of errors
      return { answer: "Sorry, an unexpected error occurred while trying to answer your question. Please try again later." };
    }
  }
);
