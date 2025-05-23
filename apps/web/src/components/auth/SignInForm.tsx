"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await signIn("email", {
        email,
        redirect: false, // We handle redirection or messages manually
        // callbackUrl: "/", // Optional: Where to redirect after successful sign-in if redirect:true
      });

      if (res?.error) {
        setMessage("Error: " + res.error);
      } else if (res?.ok) {
        setMessage("Check your email for a sign-in link!");
        setEmail(""); // Clear email field on success
      } else {
        setMessage("An unknown error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Sign-in error", error);
      setMessage("An error occurred during sign-in. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-md ${message.startsWith("Error:") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          <p className="text-sm">{message}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Sign in with Email"}
        </button>
      </div>
    </form>
  );
} 