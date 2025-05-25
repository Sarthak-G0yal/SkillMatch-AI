'use client';

import React, { useState, useEffect } from 'react';
import questions from '@/config/chatbot_questions.json';
import axios from 'axios';

export default function ChatbotPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmitAnswer = () => {
    if (!input.trim()) return;

    const question = questions[currentQuestionIndex];
    const answer = input.trim();

    const newHistory = [...chatHistory, { question, answer }];
    setChatHistory(newHistory);
    setAnswers([...answers, answer]);
    setInput('');

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitAnswers([...answers, answer]);
    }
  };

  const submitAnswers = async (finalAnswers: string[]) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/chatbot_feedback', finalAnswers);
      setFeedback(response.data.summary);
    } catch (error) {
      console.error('Failed to get feedback:', error);
      setFeedback('An error occurred while generating feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Candidate Chatbot Pre-Screening</h1>

      <div className="border border-gray-300 rounded-md p-4 h-80 overflow-y-auto mb-4 bg-white">
        {chatHistory.map((entry, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">Q: {entry.question}</p>
            <p className="ml-2">A: {entry.answer}</p>
          </div>
        ))}

        {!feedback && (
          <div className="mb-4">
            <p className="font-semibold">Q: {questions[currentQuestionIndex]}</p>
          </div>
        )}
      </div>

      {!feedback && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2"
            placeholder="Type your answer..."
            disabled={isSubmitting}
          />
          <button
            onClick={handleSubmitAnswer}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={isSubmitting}
          >
            Send
          </button>
        </div>
      )}

      {isSubmitting && <p className="mt-4 text-gray-600">Generating feedback...</p>}

      {feedback && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Candidate Summary</h2>
          <pre className="whitespace-pre-wrap">{feedback}</pre>
        </div>
      )}
    </div>
  );
}
