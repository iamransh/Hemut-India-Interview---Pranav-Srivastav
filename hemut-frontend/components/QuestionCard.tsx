"use client";

import { useEffect, useState } from "react";

export default function QuestionCard({ question }: any) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    setIsAdmin(!!token);
    setToken(token);
  }, []);

  function escalate(id: number) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `http://localhost:8000/questions/${id}/escalate`);
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    // xhr.onload = () => refresh();
    xhr.send();
  }

  function answer(id: number) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `http://localhost:8000/questions/${id}/answer`);
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    // xhr.onload = () => refresh();
    xhr.send();
  }

  return (
    <div className="bg-white p-4 shadow rounded mb-3">
      <div className="flex justify-between items-center mb-2">
        <span
          className={`px-2 py-1 rounded text-sm ${
            question.status === "ANSWERED"
              ? "bg-green-200"
              : question.status === "ESCALATED"
              ? "bg-red-200"
              : "bg-yellow-200"
          }`}
        >
          {question.status}
        </span>
      </div>
      <p className="mb-2">{question.message}</p>
      {isAdmin && (
        <div className="flex flex-col space-y-1">
          {question.status === "PENDING" && (
            <button
              onClick={() => escalate(question.question_id)}
              className="bg-red-600 font-medium text-white px-4 py-2 rounded self-start cursor-pointer"
            >
              Escalate Question
            </button>
          )}
          {question.status !== "ANSWERED" && (
            <button
              onClick={() => answer(question.question_id)}
              className="bg-green-600 font-medium text-white px-4 py-2 rounded self-start cursor-pointer"
            >
              Mark as Answered
            </button>
          )}
        </div>
      )}
      <div className="text-xs text-gray-400 mt-4">
        {new Date(question.created_at).toLocaleString()}
      </div>
    </div>
  );
}
