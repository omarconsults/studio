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
  prompt: `You are a helpful AI assistant providing health information to Africans with limited access to healthcare resources.  Please answer the following question accurately and in a way that is easy to understand.  Focus on providing information relevant to the African context, and avoid making assumptions about the availability of advanced medical treatments. Use simple, clear language. 

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
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
