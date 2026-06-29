import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO(human): fetch GET /api/hello on mount.
    // On success, store the returned `message` via setMessage(...).
    // On failure, store something via setError(...).
  }, []);

  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem" }}>
      <h1>Hello Full-Stack</h1>
      {error ? (
        <p style={{ color: "crimson" }}>Error: {error}</p>
      ) : (
        <p>{message || "Loading…"}</p>
      )}
    </main>
  );
}
