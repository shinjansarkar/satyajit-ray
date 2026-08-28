"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      let mins = now.getMinutes();
      hours = hours < 10 ? "0" + hours : hours;
      mins = mins < 10 ? "0" + mins : mins;
      setTime(`${hours}:${mins} IST`);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Return a stable initial UI to prevent hydration mismatch, or just render it
  return (
    <div className="badge">
      <span id="time-clock">{time || "00:00 IST"}</span>
    </div>
  );
}
