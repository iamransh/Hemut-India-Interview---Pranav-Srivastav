"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";

export default function SubmitQuestion() {
  const [username, setUsername] = useState("admin");
  const [email, setEmail] = useState("x@y.com");
  const [password, setPassword] = useState("admin");
  const [status, setStatus] = useState("");
  const [statusBoolean, setStatusBoolean] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (!username.trim()) {
      setStatus("Username cannot be blank");
      setStatusBoolean(false);
      return;
    }
    if (!email.trim()) {
      setStatus("Email cannot be blank");
      setStatusBoolean(false);
      return;
    }
    if (!password.trim()) {
      setStatus("Password cannot be blank");
      setStatusBoolean(false);
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/auth/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
      const res = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        localStorage.setItem("jwt_token", res.access_token); // store JWT
        setStatus("Login successful!");
        setStatusBoolean(true);
        router.push("/");
      } else {
        setStatus("Login failed. Please check your credentials.");
        setStatusBoolean(false);
      }
    };
    xhr.onerror = () => {
      setStatus("Login failed. Please check your credentials.");
      setStatusBoolean(false);
    };
    xhr.send(JSON.stringify({ username, email, password }));
  };

  const handleRegister = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/auth/register", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
      if (xhr.status === 200) {
        setStatus("Registration successful! Please login now.");
        setStatusBoolean(true);
      } else {
        setStatus(`Registration failed`);
        setStatusBoolean(false);
      }
    };
    xhr.onerror = () => {
      setStatus(`Registration failed`);
      setStatusBoolean(false);
    };
    xhr.send(
      JSON.stringify({ username: "admin", email: "x@y.com", password: "admin" })
    );
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <div className="mb-3">
          <label className="block mb-1 font-semibold">Username:</label>
          <input
            className="w-full p-2 border rounded mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-semibold">Email:</label>
          <input
            className="w-full p-2 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-semibold">Password:</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <button
            onClick={handleLogin}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            Register
          </button>
        </div>
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
