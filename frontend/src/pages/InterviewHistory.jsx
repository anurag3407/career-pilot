import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { interviewApi } from "../services/api";

export default function InterviewHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await interviewApi.getHistory();

      console.log("History Response:", response);

      setHistory(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Interview History
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        history.map((session) => (
          <div
            key={session._id}
            className="border p-4 rounded-lg mb-4"
          >
            <h3>{session.jobRole}</h3>

            <button
              onClick={() =>
                navigate(`/interview-history/${session._id}`)
              }
            >
              Replay
            </button>
          </div>
        ))
      )}
    </div>
  );
}