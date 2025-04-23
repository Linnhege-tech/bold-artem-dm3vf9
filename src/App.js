import React, { useState, useEffect } from "react";
import "./styles.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const moods = ["😁", "😊", "😐", "😟", "😡"];
const moodLabels = {
  "😁": 5,
  "😊": 4,
  "😐": 3,
  "😟": 2,
  "😡": 1,
};

// 🔁 Dette er funksjonen som sender til GCP (vi fyller inn URL senere)
const sendToPubSub = async (emoji) => {
  const timestamp = new Date().toISOString();
  const payload = {
    mood: emoji,
    timestamp: timestamp,
  };

  try {
    const response = await fetch(
      "https://REGION-PROJECTID.cloudfunctions.net/sendMood", // 🔁 Endres i neste steg
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Feil ved sending til Pub/Sub");
    }

    console.log("✅ Data sendt til Pub/Sub!");
  } catch (error) {
    console.error("❌ Klarte ikke sende:", error);
  }
};

export default function App() {
  const [mood, setMood] = useState("");

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem("mood-tracker") || "[]");
    if (savedList.length > 0) {
      setMood(savedList[savedList.length - 1].mood);
    }
  }, []);

  const handleMoodClick = (emoji) => {
    const now = new Date().toISOString();
    const savedList = JSON.parse(localStorage.getItem("mood-tracker") || "[]");
    savedList.push({ mood: emoji, timestamp: now });
    localStorage.setItem("mood-tracker", JSON.stringify(savedList));
    setMood(emoji);
    sendToPubSub(emoji); // 📤 Send til GCP
  };

  const moodData = JSON.parse(localStorage.getItem("mood-tracker") || "[]").map(
    (entry, index) => ({
      index,
      mood: moodLabels[entry.mood],
      time: entry.timestamp.slice(11, 16),
    })
  );

  return (
    <div className="app-container">
      <h1>Følelser, minutt for minutt</h1>

      <div className="emoji-row">
        {moods.map((emoji, index) => (
          <span
            key={index}
            className={`emoji ${mood === emoji ? "selected" : ""}`}
            onClick={() => handleMoodClick(emoji)}
          >
            {emoji}
          </span>
        ))}
      </div>

      {mood && (
        <p className="mood-message">
          You selected: <strong>{mood}</strong>
        </p>
      )}

      {moodData.length > 0 && (
        <div className="chart-box">
          <h3>Følelsene dine over tid</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
