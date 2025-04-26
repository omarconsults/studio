'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Utensils, Activity, ShieldCheck, Droplets, Baby, Brain, X } from 'lucide-react';
import { answerHealthQuestions } from '@/ai/flows/answer-health-questions'; // Reuse the existing flow

type Topic = {
  title: string;
  icon: React.ElementType;
  description: string;
  query: string; // Specific query for the AI
};

const topics: Topic[] = [
  {
    title: 'Nutrition & Diet',
    icon: Utensils,
    description: 'Healthy eating tips and guides.',
    query: 'Explain the basics of good nutrition and a healthy diet, focusing on accessible foods and common dietary challenges in African contexts. Keep it simple and easy to understand.',
  },
  {
    title: 'Exercise & Fitness',
    icon: Activity,
    description: 'Stay active for better health.',
    query: 'Explain the importance of regular exercise and suggest simple, accessible fitness activities suitable for people in Africa. Keep it simple and easy to understand.',
  },
  {
    title: 'Common Illnesses',
    icon: ShieldCheck,
    description: 'Info on malaria, typhoid, etc.',
    query: 'Briefly explain common illnesses in Africa like malaria and typhoid, focusing on prevention and recognizing symptoms. Keep it simple and easy to understand. Do not give medical advice.',
  },
  {
    title: 'Hygiene & Sanitation',
    icon: Droplets,
    description: 'Prevent diseases with good hygiene.',
    query: 'Explain the importance of basic hygiene practices like handwashing and sanitation for preventing diseases in African communities. Keep it simple and easy to understand.',
  },
  {
    title: 'Maternal & Child Health',
    icon: Baby,
    description: 'Care for mothers and children.',
    query: 'Provide simple, essential health tips for pregnant women and young children in Africa, focusing on nutrition and basic care. Keep it easy to understand. Do not give medical advice.',
  },
  {
    title: 'Mental Wellness',
    icon: Brain,
    description: 'Tips for mental health and wellbeing.',
    query: 'Explain the importance of mental wellness and provide simple, culturally relevant tips for managing stress and promoting mental health in African contexts. Keep it easy to understand.',
  },
];

export function PopularHealthTopics() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTopicClick = async (topic: Topic) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setError(null);
    setExplanation(null);
    setIsDialogOpen(true); // Open the dialog immediately

    try {
      const result = await answerHealthQuestions({ question: topic.query });
      setExplanation(result.answer);
    } catch (err) {
      console.error('Error fetching explanation:', err);
      setError('Sorry, something went wrong while getting the explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    // Reset state after dialog closes (optional, keeps it clean)
    setTimeout(() => {
        setSelectedTopic(null);
        setExplanation(null);
        setError(null);
        setIsLoading(false);
    }, 300); // Delay to allow fade-out animation
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
           // Use DialogTrigger directly on the interactive element
           <Card
             key={topic.title}
             onClick={() => handleTopicClick(topic)}
             className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
             role="button" // Add role for accessibility
             tabIndex={0} // Make it focusable
             onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTopicClick(topic); }} // Keyboard accessibility
           >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-primary group-hover:text-accent">
                {topic.title}
              </CardTitle>
              <topic.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{topic.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Single Dialog for Explanations */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         {/* We removed DialogTrigger from here as it's now on the Card */}
        <DialogContent className="sm:max-w-[600px]" onInteractOutside={closeDialog} onEscapeKeyDown={closeDialog}>
           <DialogHeader>
             <DialogTitle className="text-2xl text-primary">{selectedTopic?.title}</DialogTitle>
             <DialogDescription>
                AI-generated explanation. Remember this is for informational purposes only and not a substitute for professional medical advice.
             </DialogDescription>
           </DialogHeader>
           <div className="py-4 max-h-[60vh] overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span>Loading explanation...</span>
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {explanation && !isLoading && (
                <p className="text-sm text-foreground whitespace-pre-wrap">{explanation}</p>
              )}
           </div>
          <DialogFooter>
            <DialogClose asChild>
               <Button type="button" variant="secondary" onClick={closeDialog}>
                  Close
               </Button>
             </DialogClose>
          </DialogFooter>
           {/* Add explicit close button for better accessibility */}
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
