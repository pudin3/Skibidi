"use client";

import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import QuestionForm from "./QuestionForm";
import { ListSkeleton } from "./Skeletons";
import { useRealtimeQuestions } from "@/hooks/useRealtimeQuestions";

export default function TanyaTab({ presentationId }: { presentationId: string | null }) {
  const { questions, loading, refresh } = useRealtimeQuestions();

  return (
    <div className="space-y-6 animate-fade-in">
      <QuestionForm presentationId={presentationId} onSubmitted={refresh} />

      <div>
        <h3 className="font-display font-semibold text-navy-700 mb-3 text-sm uppercase tracking-wide">
          Pertanyaan masuk
        </h3>
        {loading ? (
          <ListSkeleton />
        ) : questions.length === 0 ? (
          <p className="text-sm text-navy-400 text-center py-6">
            Belum ada pertanyaan. Jadilah yang pertama bertanya!
          </p>
        ) : (
          <ul className="space-y-3">
            {questions.map((q) => (
              <li
                key={q.id}
                className="rounded-xl border border-navy-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-navy-900 text-sm">
                    {q.nama}
                    {q.kelompok && (
                      <span className="text-navy-400 font-normal"> · {q.kelompok}</span>
                    )}
                  </span>
                  <span className="text-xs text-navy-300 whitespace-nowrap">
                    {formatDistanceToNow(new Date(q.created_at), {
                      addSuffix: true,
                      locale: idLocale,
                    })}
                  </span>
                </div>
                <p className="text-sm text-navy-700 mt-1.5">{q.pertanyaan}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
