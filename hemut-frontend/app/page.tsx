"use client";

import { useEffect, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import Navbar from "../components/Navbar";

export default function Home() {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    // Fetch initial questions
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => {
        console.log("Initial questions fetched:", data);
        setQuestions(data);
      });

    // WebSocket for live updates
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("WebSocket message received:", data);

      switch (data.event) {
        case "new_question":
          setQuestions((prev) => [data.question, ...prev]);
          break;
        case "marked_answered":
          setQuestions((prev) =>
            prev.map((q) =>
              q.question_id === data?.question_id
                ? { ...q, status: "ANSWERED" }
                : q
            )
          );
          break;
        case "marked_escalated":
          setQuestions((prev) =>
            prev.map((q) =>
              q.question_id === data?.question_id
                ? { ...q, status: "ESCALATED" }
                : q
            )
          );
          break;
        default:
          break;
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-4">Live Q&A</h2>
        {questions.map((q: any, index: number) => (
          <QuestionCard key={index} question={q} />
        ))}
      </div>
    </div>
  );
}
