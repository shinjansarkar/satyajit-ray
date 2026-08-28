"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function LiveCounter() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    // Determine backend URL. Assuming local for dev, replace with production URL as needed.
    // In production, this should ideally be an environment variable.
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    const socket = io(backendUrl);

    socket.on("visitorCountUpdate", (newCount) => {
      setCount(newCount);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="badge">
      <span className="live-dot"></span>
      <span id="listener-count">{count} here now</span>
    </div>
  );
}
