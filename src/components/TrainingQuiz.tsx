"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Question = {
  id: string;
  promptVi: string;
  promptEn: string;
  choicesVi: string[];
  choicesEn: string[];
};

export function TrainingQuiz({
  moduleId,
  questions,
  locale,
}: {
  moduleId: string;
  questions: Question[];
  locale: "vi" | "en";
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(
    questions.map(() => 0),
  );
  const [result, setResult] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/training/${moduleId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const json = await res.json();
    if (json.ok) {
      setResult(
        json.data.passed
          ? `Đạt ${json.data.score}/3`
          : `Chưa đạt ${json.data.score}/3`,
      );
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-6">
      {questions.map((q, qi) => (
        <fieldset key={q.id} className="rounded-xl border border-cocoa/15 p-4">
          <legend className="font-medium">
            {locale === "vi" ? q.promptVi : q.promptEn}
          </legend>
          <div className="mt-2 space-y-2">
            {(locale === "vi" ? q.choicesVi : q.choicesEn).map((choice, ci) => (
              <label key={ci} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[qi] === ci}
                  onChange={() => {
                    const next = [...answers];
                    next[qi] = ci;
                    setAnswers(next);
                  }}
                />
                {choice}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <button
        type="submit"
        className="rounded-full bg-pandan px-4 py-2 text-sm text-paper"
      >
        Nộp bài
      </button>
      {result ? <p className="text-sm text-cocoa">{result}</p> : null}
    </form>
  );
}
