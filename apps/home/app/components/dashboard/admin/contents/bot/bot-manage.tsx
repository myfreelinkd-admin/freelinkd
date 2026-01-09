"use client";

import { useState } from "react";
import { Plus, MessageSquare, Reply } from "lucide-react";
import { BotLogicHook } from "./logic-bot";

interface BotManageProps {
  logic: BotLogicHook;
}

export default function BotManage({ logic }: BotManageProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-(--primary) flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-(--secondary)" /> Add New Q&A Pair
        </h2>
        <p className="text-gray-400 text-xs mt-1">
          Create new training data for the bot.
        </p>
      </div>

      <div className="space-y-5 flex-1">
        <div className="space-y-2">
          <label className="text-sm font-bold text-(--primary) flex items-center gap-2">
            Question
          </label>
          <div className="relative group">
            <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
            <textarea
              value={logic.question}
              onChange={(e) => logic.setQuestion(e.target.value)}
              placeholder="e.g., How do I reset my password?"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium resize-none h-28"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-(--primary) flex items-center gap-2">
            Answer
          </label>
          <div className="relative group">
             <Reply className="absolute left-4 top-4 w-4 h-4 text-gray-400 group-focus-within:text-(--secondary) transition-colors" />
            <textarea
              value={logic.answer}
              onChange={(e) => logic.setAnswer(e.target.value)}
              placeholder="e.g., Go to settings and click 'Reset Password'"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-(--alternative)/30 border border-transparent focus:border-(--secondary) focus:bg-white outline-none transition-all text-sm font-medium resize-none h-28"
            />
          </div>
        </div>
      </div>

       <button
        onClick={logic.addToQueue}
        disabled={!logic.question || !logic.answer}
        className="mt-6 w-full py-3.5 bg-(--primary) text-white rounded-xl font-bold text-sm shadow-lg shadow-(--primary)/20 hover:bg-(--primary)/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Add to Queue
      </button>
    </div>
  );
}
