import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Activity, ShieldCheck, Droplets, Baby, Brain } from 'lucide-react';
import Link from 'next/link'; // Assuming topics link somewhere eventually

const topics = [
  { title: 'Nutrition & Diet', icon: Utensils, description: 'Healthy eating tips and guides.', link: '#' },
  { title: 'Exercise & Fitness', icon: Activity, description: 'Stay active for better health.', link: '#' },
  { title: 'Common Illnesses', icon: ShieldCheck, description: 'Info on malaria, typhoid, etc.', link: '#' },
  { title: 'Hygiene & Sanitation', icon: Droplets, description: 'Prevent diseases with good hygiene.', link: '#' },
  { title: 'Maternal & Child Health', icon: Baby, description: 'Care for mothers and children.', link: '#' },
  { title: 'Mental Wellness', icon: Brain, description: 'Tips for mental health and wellbeing.', link: '#' },
];

export function PopularHealthTopics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <Link href={topic.link} key={topic.title} passHref legacyBehavior>
          <a className="block group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group-hover:border-primary">
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
          </a>
        </Link>
      ))}
    </div>
  );
}
