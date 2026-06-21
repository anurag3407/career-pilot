import logger from '../utils/logger';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { interviewApi } from "../services/api";

export default function InterviewReplay() {
  const { id } = useParams();

  const [interview, setInterview] = useState(null);

  useEffect(() => {
    loadInterview();
  }, []);

  const loadInterview = async () => {
    try {
      const response = await interviewApi.getInterview(id);

      setInterview(response.data);
    } catch (error) {
      logger.error('failed to load interview replay:', error);
    }
  };

  if (!interview) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Interview Replay
      </h1>

      <pre>
        {JSON.stringify(interview, null, 2)}
      </pre>
    </div>
  );
}