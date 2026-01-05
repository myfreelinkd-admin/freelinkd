"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  image: string;
  isJoined: boolean;
}

const eventsData: Event[] = [
  {
    id: 1,
    title: "UI/UX Design Masterclass 2026",
    organizer: "Design Society",
    date: "15 Jan 2026",
    time: "10:00 AM - 04:00 PM",
    location: "Jakarta Design Center / Online",
    attendees: 128,
    category: "Workshop",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
    isJoined: true,
  },
  {
    id: 2,
    title: "Freelancer Networking Night",
    organizer: "FreeLinkd Community",
    date: "20 Jan 2026",
    time: "07:00 PM - 09:00 PM",
    location: "The Co-Working Space, Bandung",
    attendees: 45,
    category: "Networking",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    isJoined: false,
  },
  {
    id: 3,
    title: "Next.js 16 Deep Dive",
    organizer: "Tech Talk ID",
    date: "25 Jan 2026",
    time: "01:00 PM - 03:00 PM",
    location: "Online (Zoom)",
    attendees: 250,
    category: "Webinar",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    isJoined: false,
  },
  {
    id: 4,
    title: "Startup Pitching Competition",
    organizer: "Venture Capital Hub",
    date: "02 Feb 2026",
    time: "09:00 AM - 05:00 PM",
    location: "Grand Ballroom, Jakarta",
    attendees: 80,
    category: "Competition",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800",
    isJoined: false,
  },
];

export default function Events() {
  const [events, setEvents] = useState(eventsData);

  const handleJoin = (id: number) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, isJoined: true } : event
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events, workshops, or webinars..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-(--secondary)/20 outline-none transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-(--primary) hover:bg-gray-50 transition-all cursor-pointer">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-(--secondary) rounded-2xl text-sm font-bold text-white hover:bg-(--secondary)/90 transition-all shadow-lg shadow-(--secondary)/10 cursor-pointer">
            Recommended
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="group bg-white rounded-[40px] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-(--primary)/5 transition-all duration-500 flex flex-col"
          >
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
              <Image
                src={event.image}
                alt={event.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md text-(--primary) text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {event.category}
                </span>
              </div>
              {event.isJoined && (
                <div className="absolute inset-0 bg-(--primary)/40 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
                  <div className="bg-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl transform -rotate-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-bold text-(--primary)">
                      You already join
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-(--secondary)/10 flex items-center justify-center text-(--secondary) font-bold text-xs">
                  {event.organizer.charAt(0)}
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {event.organizer}
                </span>
              </div>

              <h3 className="text-xl font-bold text-(--primary) mb-4 group-hover:text-(--secondary) transition-colors line-clamp-2">
                {event.title}
              </h3>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <Calendar className="w-4 h-4 text-(--secondary)" />
                  {event.date} • {event.time}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <MapPin className="w-4 h-4 text-(--secondary)" />
                  {event.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <Users className="w-4 h-4 text-(--secondary)" />
                  {event.attendees} Freelancers joined
                </div>
              </div>

              <div className="mt-auto">
                {!event.isJoined ? (
                  <button
                    onClick={() => handleJoin(event.id)}
                    className="w-full py-4 bg-(--alternative) hover:bg-(--secondary) hover:text-white text-(--primary) rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                  >
                    Join Event
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Registered
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
