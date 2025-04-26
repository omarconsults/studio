'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { HelpCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"; // Import useToast

const FormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }).optional().or(z.literal('')), // Optional email
  question: z.string().min(10, {
    message: 'Please enter your question or topic suggestion (at least 10 characters).',
  }),
});

export function UserQuestionForm() {
  const { toast } = useToast(); // Get toast function

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      question: '',
    },
  });

  // Mock submission handler - displays a toast message
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('Form submitted (mock):', data);
    toast({
      title: "Submission Received!",
      description: "Thank you for your question/suggestion. We'll review it.",
      variant: "default", // Use default variant for success-like message
    });
    form.reset(); // Reset form after mock submission
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          Submit Your Question or Suggestion
        </CardTitle>
        <CardDescription>
          Have a specific health question or a topic you'd like us to cover? Let us know!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Your Email (Optional)</FormLabel>
                  <FormControl>
                    <Input id="email" type="email" placeholder="you@example.com" {...field} aria-invalid={!!form.formState.errors.email} aria-describedby="email-error"/>
                  </FormControl>
                   <FormMessage id="email-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="user-question">Your Question or Topic Suggestion</FormLabel>
                  <FormControl>
                    <Textarea
                      id="user-question"
                      placeholder="e.g., Can you provide more information on preventing cholera?"
                      className="resize-none"
                      rows={5}
                      {...field}
                       aria-invalid={!!form.formState.errors.question}
                       aria-describedby="user-question-error"
                    />
                  </FormControl>
                  <FormMessage id="user-question-error"/>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Submit Question/Suggestion
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
