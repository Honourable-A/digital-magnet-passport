import { ExplanationCard } from "@/components/ai/explanation-card";
import { assistantPrompts } from "@/data/assistant/explanations";

export default function AssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          AI Explanation Prototype
        </h1>

        <p className="mt-1 text-muted-foreground">
          Explain provenance, restricted data, composition, recycling and supply-chain risk.
        </p>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          This prototype demonstrates the intended Generative UI behaviour.
          It is used only for explanation and does not make access-control,
          compliance or verification decisions.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        {assistantPrompts.map((item) => (
          <ExplanationCard
            key={item.id}
            id={item.id}
            title={item.title}
            question={item.question}
          />
        ))}
      </section>
    </div>
  );
}