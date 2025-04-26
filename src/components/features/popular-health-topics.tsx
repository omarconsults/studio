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
  DialogClose,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Utensils, Activity, ShieldCheck, Droplets, Baby, Brain, X, Info } from 'lucide-react';
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

  // State for detailed explanation
  const [detailedExplanation, setDetailedExplanation] = useState<string | null>(null);
  const [isDetailedLoading, setIsDetailedLoading] = useState(false);
  const [detailedError, setDetailedError] = useState<string | null>(null);

  const handleTopicClick = async (topic: Topic) => {
    // Reset previous detailed state if a new topic is clicked
    setDetailedExplanation(null);
    setDetailedError(null);
    setIsDetailedLoading(false);

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

  const handleMoreInfoClick = async () => {
    if (!selectedTopic || !explanation) return;

    setIsDetailedLoading(true);
    setDetailedError(null);

    // Construct a query asking for more details based on the initial explanation
    const detailedQuery = `Provide more detailed information about "${selectedTopic.title}". Please expand significantly on the points mentioned in the initial explanation provided below, offering more depth, practical examples, and actionable advice specifically relevant to the African context. Maintain accessible language but provide a comprehensive follow-up.\n\nInitial Explanation:\n"${explanation}"`;

    try {
      const result = await answerHealthQuestions({ question: detailedQuery });
      setDetailedExplanation(result.answer);
    } catch (err) {
      console.error('Error fetching detailed explanation:', err);
      setDetailedError('Sorry, something went wrong while getting more details. Please try again.');
    } finally {
      setIsDetailedLoading(false);
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
        setDetailedExplanation(null); // Reset detailed state
        setDetailedError(null);      // Reset detailed state
        setIsDetailedLoading(false); // Reset detailed state
    }, 300); // Delay to allow fade-out animation
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
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
        <DialogContent className="sm:max-w-[600px]" onInteractOutside={closeDialog} onEscapeKeyDown={closeDialog}>
           <DialogHeader>
             <DialogTitle className="text-2xl text-primary">{selectedTopic?.title}</DialogTitle>
             <DialogDescription>
                AI-generated explanation. Remember this is for informational purposes only and not a substitute for professional medical advice.
             </DialogDescription>
           </DialogHeader>
           <div className="py-4 max-h-[60vh] overflow-y-auto space-y-4">
              {/* Initial Loading and Error */}
              {isLoading && (
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
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

              {/* Initial Explanation */}
              {explanation && !isLoading && (
                <div>
                    <h4 className="font-semibold mb-2 text-primary">Overview:</h4>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{explanation}</p>
                </div>
              )}

              {/* "More Information" Button */}
              {explanation && !isLoading && !detailedExplanation && !detailedError && (
                <div className="flex justify-center">
                  <Button
                      onClick={handleMoreInfoClick}
                      variant="outline"
                      size="sm"
                      className="mt-4 border-primary text-primary hover:bg-primary/10"
                      disabled={isDetailedLoading}
                  >
                      {isDetailedLoading ? (
                          <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Getting More Details...
                          </>
                      ) : (
                         <>
                            <Info className="mr-2 h-4 w-4" />
                            Need More Information?
                         </>
                      )}
                  </Button>
                 </div>
              )}

               {/* Detailed Loading */}
              {isDetailedLoading && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading more details...</span>
                </div>
              )}

              {/* Detailed Error */}
              {detailedError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error Fetching Details</AlertTitle>
                    <AlertDescription>{detailedError}</AlertDescription>
                </Alert>
              )}

              {/* Detailed Explanation */}
              {detailedExplanation && !isDetailedLoading && (
                  <div className="mt-6 border-t pt-4">
                      <h4 className="font-semibold mb-2 text-primary">Detailed Information:</h4>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{detailedExplanation}</p>
                  </div>
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
