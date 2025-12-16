"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    setIsAdmin(!!token);
  }, []);

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between">
      <h1 className="font-bold text-xl">Q&A Dashboard</h1>
      <div className="space-x-4">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <Link href="/submit" className="hover:text-blue-600">
          Submit Question
        </Link>
        {isAdmin ? null : (
          <Link href="/login" className="hover:text-blue-600">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
