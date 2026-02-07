import React, { useState, useEffect } from "react";
import { FaMagic } from "react-icons/fa";


const ResumeAi = () => {
  const [resume, setresume] = useState("");
  const [jd, setjd] = useState("");
  const [loading, setloading] = useState(false);
  const [result, setresult] = useState(null);
  const [history, sethistory] = useState([]);

  const token=localStorage.getItem('token');

  const analyseresume = async () => {
    if (loading) return;

    try {
      setloading(true);
      setresult(null);

// CAUTION->OPEN AI API ARENT FREE.IF MADE AVAILABLE INCLUDE THEM IN .env TO FETCH DATA
const res = await fetch("http://localhost:5000/api/resume", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    resumeText: resume,
    jobDescription: jd,
  }),
});


      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setresult(data);

      // refresh history after analysis
      fetchHistory();
    } catch (err) {
      setresult(null);
      alert("AI analysis failed");
    } finally {
      setloading(false);
    }
  };

const fetchHistory = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/ai-history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch history");

    const data = await res.json();

    if (Array.isArray(data)) {
      sethistory(data);
    }
  } catch (err) {
    console.log("Failed to fetch history", err);
  }
};

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10 ml-[5%]">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Resume AI</h1>
        <p className="text-gray-500">AI-powered ATS analysis</p>
      </div>

      {/* Inputs */}
      <div className="grid lg:grid-cols-2 gap-6">
        <textarea
          rows={8}
          placeholder="Paste resume..."
          className="border p-4 rounded-xl"
          value={resume}
          onChange={(e) => setresume(e.target.value)}
        />
        <textarea
          rows={8}
          placeholder="Paste job description..."
          className="border p-4 rounded-xl"
          value={jd}
          onChange={(e) => setjd(e.target.value)}
        />
      </div>

      {/* Button */}
      <button
        onClick={analyseresume}
        disabled={!resume || !jd || loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl flex gap-2"
      >
        <FaMagic />
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {/* Result */}
      {result && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-blue-600">
              {result.score}%
            </h2>
            <p className="text-gray-500">ATS Match Score</p>
          </div>

          <div>
            <h3 className="font-semibold">Missing Skills</h3>
            <ul className="list-disc list-inside text-gray-600">
              {result.missingSkills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Suggestions</h3>
            <ul className="list-disc list-inside text-gray-600">
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}


      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent AI Analysis</h3>

          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded-xl flex justify-between"
              >
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <p className="font-medium">
                    Match Score: {item.score}%
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${item.score >= 80
                    ? "bg-green-100 text-green-700"
                    : item.score >= 60
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {item.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAi;
