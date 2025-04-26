'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { answerHealthQuestions } from '@/ai/flows/answer-health-questions'; // Import the server action
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, MessageSquare, AlertTriangle } from 'lucide-react';

const FormSchema = z.object({
  question: z.string().min(10, {
    message: 'Please enter a question with at least 10 characters.',
  }),
});

export function AiHealthAssistant() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const result = await answerHealthQuestions({ question: data.question });
      setAnswer(result.answer);
    } catch (err) {
      console.error('Error fetching answer:', err);
      setError('Sorry, something went wrong while getting your answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Ask a Health Question
        </CardTitle>
        <CardDescription>
          Get health information relevant to the African context. Please remember this is not a substitute for professional medical advice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="question">Your Question</FormLabel>
                  <FormControl>
                    <Textarea
                      id="question"
                      placeholder="e.g., What are the common symptoms of malaria?"
                      className="resize-none"
                      rows={4}
                      {...field}
                      aria-invalid={!!form.formState.errors.question}
                      aria-describedby="question-error"
                    />
                  </FormControl>
                  <FormMessage id="question-error" />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Answer...
                </>
              ) : (
                'Ask Assistant'
              )}
            </Button>
          </form>
        </Form>

        {error && (
          <Alert variant="destructive" className="mt-6">
             <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {answer && (
          <Card className="mt-6 bg-secondary">
            <CardHeader>
              <CardTitle className="text-lg">Assistant's Response</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-secondary-foreground whitespace-pre-wrap">{answer}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
