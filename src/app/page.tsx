import { AiHealthAssistant } from '@/components/features/ai-health-assistant';
import { PopularHealthTopics } from '@/components/features/popular-health-topics';
import { UserQuestionForm } from '@/components/features/user-question-form';

export default function Home() {
  return (
    <div className="space-y-12">
      <section aria-labelledby="ai-assistant-heading">
        <h2 id="ai-assistant-heading" className="text-3xl font-bold text-center text-primary mb-8">
          Your AI Health Assistant
        </h2>
        <AiHealthAssistant />
      </section>

      <section aria-labelledby="popular-topics-heading">
         <h2 id="popular-topics-heading" className="text-3xl font-bold text-center text-primary mb-8">
          Popular Health Topics
        </h2>
        <PopularHealthTopics />
      </section>

      <section aria-labelledby="question-form-heading">
        <h2 id="question-form-heading" className="text-3xl font-bold text-center text-primary mb-8">
          Ask a Question or Suggest a Topic
        </h2>
        <UserQuestionForm />
      </section>
    </div>
  );
}
