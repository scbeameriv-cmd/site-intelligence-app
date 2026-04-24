import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      setText(event.results[0][0].transcript);
    };
  };

  const generateReport = async () => {
    setLoading(true);

    const res = await fetch("/api/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    setOutput(data.result);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Site Intelligence</h2>

      <button onClick={startRecording}>
        🎤 Record Jobsite Update
      </button>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        style={{ width: "100%", marginTop: 10 }}
        placeholder="Speak or type your jobsite update..."
      />

      <button onClick={generateReport} style={{ marginTop: 10 }}>
        Generate Report
      </button>

      {loading && <p>Processing...</p>}

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>
        {output}
      </pre>
    </div>
  );
}
