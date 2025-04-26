'use server';
/**
 * @fileOverview Summarizes lengthy health articles into key points.
 *
 * - summarizeHealthArticle - A function that summarizes a health article.
 * - SummarizeHealthArticleInput - The input type for the summarizeHealthArticle function.
 * - SummarizeHealthArticleOutput - The return type for the summarizeHealthArticle function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeHealthArticleInputSchema = z.object({
  articleContent: z.string().describe('The full text content of the health article to summarize.'),
});
export type SummarizeHealthArticleInput = z.infer<typeof SummarizeHealthArticleInputSchema>;

const SummarizeHealthArticleOutputSchema = z.object({
  summaryPoints: z.array(z.string()).describe('A list of key summary points extracted from the article.'),
});
export type SummarizeHealthArticleOutput = z.infer<typeof SummarizeHealthArticleOutputSchema>;

export async function summarizeHealthArticle(input: SummarizeHealthArticleInput): Promise<SummarizeHealthArticleOutput> {
  return summarizeHealthArticleFlow(input);
}

const summarizeHealthArticlePrompt = ai.definePrompt({
  name: 'summarizeHealthArticlePrompt',
  input: {
    schema: z.object({
      articleContent: z.string().describe('The full text content of the health article to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summaryPoints: z.array(z.string()).describe('A list of key summary points extracted from the article.'),
    }),
  },
  prompt: `You are an expert health information summarizer.

  Please read the following health article and provide a list of the key summary points.

  Article Content: {{{articleContent}}}

  Summary Points:`, // Use the same name here
});

const summarizeHealthArticleFlow = ai.defineFlow<
  typeof SummarizeHealthArticleInputSchema,
  typeof SummarizeHealthArticleOutputSchema
>(
  {
    name: 'summarizeHealthArticleFlow',
    inputSchema: SummarizeHealthArticleInputSchema,
    outputSchema: SummarizeHealthArticleOutputSchema,
  },
  async input => {
    const {output} = await summarizeHealthArticlePrompt(input);
    return output!;
  }
);
