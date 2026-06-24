import { useState } from 'react';
import { interviewApi } from '../../../services/api';

export function useInterviewSession() {
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [codingQuestion, setCodingQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersSubmitted, setAnswersSubmitted] = useState([]);
  const [warmupQuestions, setWarmupQuestions] = useState([]);
  const [warmupIndex, setWarmupIndex] = useState(0);
  const [code, setCode] = useState('');
  const [runResults, setRunResults] = useState(null);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [overallResults, setOverallResults] = useState(null);

  const switchProvider = async () => {
    if (!interviewId) return false;
    try {
      const res = await interviewApi.switchProvider(interviewId);
      if (res?.data?.analysis) {
        setAnswersSubmitted((prev) => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, analysis: res.data.analysis }];
        });
      }
      return true;
    } catch (err) {
      throw err;
    }
  };

  const runCandidateCode = async (codingLanguage) => {
    if (!interviewId || !code?.trim()) return;
    setIsRunningCode(true);
    setRunResults(null);
    try {
      const res = await interviewApi.runCode(interviewId, {
        code,
        language: codingLanguage,
        problemId: codingQuestion?.questionId || questions[0]?.questionId
      });
      setRunResults(res.data);
    } catch (err) {
      throw err;
    } finally {
      setIsRunningCode(false);
    }
  };

  const resetSession = () => {
    setInterviewId(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setOverallResults(null);
    setAnswersSubmitted([]);
    setWarmupQuestions([]);
    setWarmupIndex(0);
    setCode('');
    setRunResults(null);
  };

  return {
    interviewId, setInterviewId,
    questions, setQuestions,
    codingQuestion, setCodingQuestion,
    currentQuestionIndex, setCurrentQuestionIndex,
    answersSubmitted, setAnswersSubmitted,
    warmupQuestions, setWarmupQuestions,
    warmupIndex, setWarmupIndex,
    code, setCode,
    runResults, setRunResults,
    isRunningCode, setIsRunningCode,
    overallResults, setOverallResults,
    switchProvider,
    runCandidateCode,
    resetSession
  };
}
