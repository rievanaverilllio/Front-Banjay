"use client";

import { useState } from 'react';
import { useMemo } from 'react';

export default function AdminDashboardPage() {
  const [llmPrompt, setLlmPrompt] = useState('');
  const [llmResponse, setLlmResponse] = useState('');
  const lastUpdateDate = useMemo(() => new Date().toLocaleString(), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send llmPrompt to your LLM API
    // For now, let's simulate a response
    console.log("LLM Prompt:", llmPrompt);
    setLlmResponse("Simulated LLM response based on your prompt: " + llmPrompt);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Header */}
      <header className="bg-[#181818] p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-blue-400">Dashboard</a></li>
            <li><a href="/admin/settings" className="hover:text-blue-400">Settings</a></li>
            <li><a href="/login" className="hover:text-blue-400">Logout</a></li>
          </ul>
        </nav>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6 bg-white text-black">
        {/* Left Section: Map */}
        <section className="flex-1 bg-white rounded-lg shadow-lg p-6 flex flex-col border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Real-time Flood Map</h2>
          <div className="flex-1 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-lg border border-gray-200">
            {/* Placeholder for a large map component */}
            [ Large Interactive Map Placeholder ]
          </div>
          <p className="text-sm text-gray-700 mt-4">Data last updated: {lastUpdateDate}</p>
        </section>

        {/* Right Section: LLM Forms */}
        <section className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg p-6 flex flex-col border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">LLM Interaction</h2>
          <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
            <div>
              <label htmlFor="llm-prompt" className="block text-sm font-medium text-gray-700 mb-2">Input JSON (LLM Prompt):</label>
              <textarea
                id="llm-prompt"
                className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 resize-y min-h-[150px]"
                placeholder="Enter your JSON prompt here..."
                value={llmPrompt}
                onChange={(e) => setLlmPrompt(e.target.value)}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Send to LLM
            </button>
          </form>
          <div className="mt-6 flex-1 flex flex-col">
            <label htmlFor="llm-response" className="block text-sm font-medium text-gray-700 mb-2">LLM Response:</label>
            <textarea
              id="llm-response"
              className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 text-gray-800 resize-y min-h-[200px]"
              readOnly
              placeholder="LLM response will appear here..."
              value={llmResponse}
            ></textarea>
          </div>
        </section>
      </main>
    </div>
  );
}
