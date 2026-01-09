"use client";

import { Upload, Download, Database, FileJson, Trash2, Search } from "lucide-react";
import { BotLogicHook } from "./logic-bot";

interface ImportBotProps {
  logic: BotLogicHook;
}

export default function ImportBot({ logic }: ImportBotProps) {
  // Mock function for exporting
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logic.queue));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "bot_data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Actions & Management Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-fit">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-(--primary) flex items-center gap-2">
            <Database className="w-5 h-5 text-(--secondary)" /> Actions & Management
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Manage bot data flow and persistent storage.
          </p>
        </div>

        <div className="space-y-3">
          <button className="w-full py-3.5 bg-white border border-gray-200 text-(--primary) rounded-xl font-bold text-sm hover:border-(--secondary) hover:text-(--secondary) hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 group cursor-pointer">
            <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" /> Upload Queue into Database
          </button>
          
          <button 
            onClick={handleExport}
            className="w-full py-3.5 bg-white border border-gray-200 text-(--primary) rounded-xl font-bold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" /> Export Queue as JSON
          </button>

          <label className="w-full py-3.5 bg-white border border-gray-200 text-(--primary) rounded-xl font-bold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group cursor-pointer">
             <FileJson className="w-4 h-4 group-hover:scale-110 transition-transform" />
             <span>Import JSON File</span>
             <input type="file" className="hidden" accept=".json" />
          </label>

          <button className="w-full py-3.5 bg-white border border-gray-200 text-(--primary) rounded-xl font-bold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group cursor-pointer">
            <Database className="w-4 h-4 group-hover:scale-110 transition-transform" /> Load Existing from Database
          </button>
        </div>
      </div>

      {/* Database Entries Preview (Queue) */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex-1 flex flex-col min-h-[300px]">
         <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-(--primary) flex items-center gap-2">
              <FileJson className="w-5 h-5 text-(--secondary)" /> Queue Entries
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              {logic.queue.length} items ready to be processed.
            </p>
          </div>
          <div className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-lg">
            Queue: {logic.queue.length}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {logic.queue.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
              <Database className="w-8 h-8 opacity-50" />
              <p className="text-sm font-medium">Queue is empty</p>
            </div>
          ) : (
            logic.queue.map((item, index) => (
              <div key={index} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all group relative animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Q</span>
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.question}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-green-100 text-green-600 px-2 py-0.5 rounded">A</span>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.answer}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => logic.removeFromQueue(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
