import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What are the common symptoms of Malaria?",
    answer: "Common symptoms include fever, chills, headache, muscle aches, fatigue, nausea, and vomiting. In severe cases, it can cause jaundice, seizures, and coma. Seek medical attention if you suspect malaria.",
  },
  {
    question: "How can I prevent Typhoid fever?",
    answer: "Typhoid is spread through contaminated food and water. Prevention involves drinking safe water (boiled or bottled), practicing good hand hygiene, eating properly cooked food, and getting vaccinated if available.",
  },
  {
    question: "What are basic first aid steps for a minor burn?",
    answer: "Cool the burn immediately with cool (not cold) running water for 10-20 minutes. Cover loosely with a sterile, non-stick dressing. Do not apply ice, butter, or ointments. Seek medical help for severe or large burns.",
  },
  {
    question: "How important is hydration, especially in hot climates?",
    answer: "Hydration is crucial. Drink plenty of clean water throughout the day, especially when active or in hot weather, to prevent dehydration. Symptoms of dehydration include thirst, dark urine, dizziness, and fatigue.",
  },
  {
    question: "What are the signs of a healthy diet?",
    answer: "A healthy diet includes a variety of fruits, vegetables, whole grains, lean proteins (like beans, fish, poultry), and healthy fats. It provides energy, supports growth, and helps prevent chronic diseases. Limiting processed foods, sugar, and excessive salt is important.",
  },
  {
    question: "When should I seek medical advice for a cough?",
    answer: "Consult a doctor if your cough lasts more than 2-3 weeks, is severe, produces thick or colored mucus, is accompanied by fever, shortness of breath, chest pain, or if you cough up blood. This is not exhaustive medical advice.",
  },
];


export function FaqSection() {
  return (
    <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                 <HelpCircle className="h-6 w-6 text-primary" />
                 Common Health Questions
            </CardTitle>
        </CardHeader>
        <CardContent>
             <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger className="text-left hover:no-underline text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </CardContent>
    </Card>
  );
}
