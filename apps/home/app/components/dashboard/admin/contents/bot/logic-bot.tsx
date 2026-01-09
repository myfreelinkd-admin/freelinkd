"use client";

import { useState } from "react";

export interface BotLogicHook {
  question: string;
  setQuestion: (value: string) => void;
  answer: string;
  setAnswer: (value: string) => void;
  queue: Array<{ question: string; answer: string }>;
  addToQueue: () => void;
  removeFromQueue: (index: number) => void;
}

export function useBotLogic(): BotLogicHook {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [queue, setQueue] = useState<Array<{ question: string; answer: string }>>(
    []
  );

  const addToQueue = () => {
    if (!question.trim() || !answer.trim()) return;
    setQueue([...queue, { question, answer }]);
    setQuestion("");
    setAnswer("");
  };

  const removeFromQueue = (index: number) => {
    setQueue(queue.filter((_, i) => i !== index));
  };

  return {
    question,
    setQuestion,
    answer,
    setAnswer,
    queue,
    addToQueue,
    removeFromQueue,
  };
}
