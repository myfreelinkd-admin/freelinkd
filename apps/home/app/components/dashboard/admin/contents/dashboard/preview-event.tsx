"use client";

import { Calendar, MapPin, ArrowRight } from "lucide-react";

const events = [
  { id: 1, title: "UI/UX Masterclass", date: "15 Jan 2026", type: "Workshop" },
  { id: 2, title: "Freelancer Night", date: "20 Jan 2026", type: "Networking" },
  { id: 3, title: "Next.js Deep Dive", date: "25 Jan 2026", type: "Webinar" },
  {
    id: 4,
    title: "Startup Pitching",
    date: "02 Feb 2026",
    type: "Competition",
  },
  { id: 5, title: "Design Thinking", date: "10 Feb 2026", type: "Workshop" },
];

export default function PreviewEvent() {
  return (
    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 h-100 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-(--primary)">Events</h2>
            <p className="text-xs text-gray-400 font-medium">
              Upcoming community activities.
            </p>
          </div>
        </div>
        <button className="text-xs font-bold text-(--secondary) hover:underline flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 overscroll-contain custom-scrollbar">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-orange-100 hover:bg-orange-50/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex flex-col items-center justify-center shadow-sm border border-gray-100">
                  <span className="text-[8px] font-bold text-orange-600 uppercase">
                    {event.date.split(" ")[1]}
                  </span>
                  <span className="text-xs font-bold text-(--primary)">
                    {event.date.split(" ")[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-(--primary)">
                    {event.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {event.type}
                  </p>
                </div>
              </div>
              <button className="p-2 rounded-lg bg-white text-gray-400 hover:text-(--secondary) transition-colors shadow-sm">
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
