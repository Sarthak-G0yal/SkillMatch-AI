'use client'

import React, { useState } from 'react'
import questions from '@/config/chatbot_questions.json'

type QA = {
  question: string
  answer: string
}

export default function ChatbotPage() {
  const [step, setStep] = useState(0)
  const [history, setHistory] = useState<QA[]>([])
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const currentQuestion = questions[step]
    const newEntry: QA = { question: currentQuestion, answer: input }

    const updatedHistory = [...history, newEntry]
    setHistory(updatedHistory)
    setInput('')

    if (step + 1 === questions.length) {
      setLoading(true)
      try {
        const answers = updatedHistory.map((entry) => entry.answer);

        const res = await fetch('/api/chatbot_feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }), 
        })

        const data = await res.json()
        // setFeedback(data.summary || 'No feedback received.')
        // Combine the two fields into one string:
        if (data.strengths || data.weaknesses) {
        setFeedback(`${data.strengths || ''}\n\n${data.weaknesses || ''}`)
        } 
        else {
            setFeedback('No feedback received.')
        }
      } catch (err) {
        console.error('Error generating feedback:', err)
        setFeedback('Error generating feedback. Please try again.')
      } finally {
        setLoading(false)
      }
    } else {
      setStep(step + 1)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Candidate Chatbot Pre-Screening</h1>

      <div className="border rounded p-4 h-64 overflow-y-auto mb-4 bg-gray-50">
        {history.map((entry, idx) => (
          <div key={idx} className="mb-4">
            <p className="font-medium text-gray-700">Q: {entry.question}</p>
            <p className="text-gray-900">A: {entry.answer}</p>
          </div>
        ))}
      </div>

      {feedback ? (
        <div className="mt-6 border p-4 rounded bg-green-50 whitespace-pre-wrap">
          <h2 className="text-xl font-bold text-green-800 mb-2">Feedback Summary</h2>
          <p className="text-gray-800">{feedback}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="block font-medium text-gray-700 mb-2">
            {questions[step]}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2 mb-2"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {step + 1 === questions.length ? 'Submit Answers' : 'Next Question'}
          </button>
        </form>
      )}

      {loading && <p className="text-gray-500 mt-4">Processing feedback...</p>}
    </div>
  )
}
