"use client";
import { useState } from "react";

const slots = [
  "2025-05-25 10:00 AM",
  "2025-05-25 2:00 PM",
  "2025-05-26 11:00 AM",
];

export default function SchedulerPage() {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleBooking = async () => {
  const res = await fetch("http://localhost:8000/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, slot: selectedSlot }),
  });

  const data = await res.json();
  setMessage(data.message || "Booking failed");

  if (data.event_link) {
    setMessage(`${data.message}. View on Google Calendar: ${data.event_link}`);
  }
};

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Schedule an Interview</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="border p-2 mb-4 block w-full"
      />
      <div className="space-y-2 mb-4">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            className={`block w-full p-2 border rounded ${
              selectedSlot === slot ? "bg-blue-100 border-blue-500" : ""
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
      <button
        onClick={handleBooking}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!name || !selectedSlot}
      >
        Book Interview
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
