"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";

export default function SubmitQuestion() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [statusBoolean, setStatusBoolean] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (!message.trim()) {
      setStatus("Question cannot be blank");
      setStatusBoolean(false);
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/questions", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
      setStatus("Question submitted!");
      setStatusBoolean(true);
      setMessage("");
      router.push("/");
    };
    xhr.onerror = () => {
      setStatus("Failed to submit question. Please try again.");
      setStatusBoolean(false);
    };
    xhr.send(JSON.stringify({ message }));
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Submit a Question</h2>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
        {status && (
          <p
            className={`mt-2 ${
              statusBoolean ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
