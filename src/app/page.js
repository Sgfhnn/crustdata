"use client";

import { useState } from 'react';
import { mockProfiles } from '../../mockData';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const generateOutreach = async () => {
    if (!url.trim()) {
      setError("Please enter a LinkedIn URL.");
      return;
    }
    setError('');
    setLoading(true);
    setResult('');

    try {
      // For simplicity, select a random mock profile
      const randomProfile = mockProfiles[Math.floor(Math.random() * mockProfiles.length)];

      const prompt = `Write a short, personalized outreach message to this person based on their recent posts. Person: ${randomProfile.name}, Title: ${randomProfile.title}, Recent posts: ${randomProfile.recentPosts.join(" | ")}`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-neutral-800 rounded-xl shadow-lg p-8 border border-neutral-700">
        <h1 className="text-3xl font-bold mb-2 text-center text-white">AI Sales Outreach</h1>
        <p className="text-neutral-400 text-center mb-8">Powered by Crustdata APIs (Mock) & Gemini AI</p>

        <div className="space-y-6">
          <div>
            <label htmlFor="linkedin-url" className="block text-sm font-medium mb-2 text-neutral-300">
              LinkedIn Profile URL
            </label>
            <input
              id="linkedin-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-neutral-500 transition"
              disabled={loading}
            />
          </div>

          <button
            onClick={generateOutreach}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </span>
            ) : "Generate Outreach"}
          </button>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-3">Generated Message:</h2>
              <div className="bg-neutral-900 p-5 rounded-lg border border-neutral-700 whitespace-pre-wrap text-neutral-200 leading-relaxed">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
