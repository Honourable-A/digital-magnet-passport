"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import {
  type AssistantPromptId,
  generateAssistantExplanation,
} from "@/data/assistant/explanations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ExplanationCardProps = {
  id: AssistantPromptId;
  title: string;
  question: string;
};

export function ExplanationCard({
  id,
  title,
  question,
}: ExplanationCardProps) {
  const [response, setResponse] = useState<string | null>(null);
  const [responseTitle, setResponseTitle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  function handleGenerate() {
    setIsGenerating(true);
    setResponse(null);
    setResponseTitle(null);

    window.setTimeout(() => {
      const generated = generateAssistantExplanation(id);

      setResponseTitle(generated.title);
      setResponse(generated.response);
      setIsGenerating(false);
    }, 500);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            Example question
          </p>

          <p className="mt-1 font-medium">
            {question}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            "Generate explanation"
          )}
        </Button>

        {response && responseTitle && (
          <div className="rounded-lg border p-4">
            <p className="font-medium">
              {responseTitle}
            </p>

            <p className="mt-2 leading-relaxed text-muted-foreground">
              {response}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}