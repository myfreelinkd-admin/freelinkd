"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  category: string;
  image: string;
  status: "Published" | "Draft" | "Ended";
}

const adminEventsData: Event[] = [
  {
    id: 1,
    title: "UI/UX Design Masterclass 2026",
    organizer: "Design Society",
    date: "15 Jan 2026",
    time: "10:00 AM - 04:00 PM",
    location: "Jakarta Design Center / Online",
    attendees: 128,
    maxAttendees: 200,
    category: "Workshop",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
    status: "Published",
  },
  {
    id: 2,
    title: "Freelancer Networking Night",
    organizer: "FreeLinkd Community",
    date: "20 Jan 2026",
    time: "07:00 PM - 09:00 PM",
    location: "The Co-Working Space, Bandung",
    attendees: 45,
    maxAttendees: 50,
    category: "Networking",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    status: "Draft",
  },
  {
    id: 3,
    title: "Next.js 16 Deep Dive",
    organizer: "Tech Talk ID",
    date: "25 Jan 2026",
    time: "01:00 PM - 03:00 PM",
    location: "Online (Zoom)",
    attendees: 250,
    maxAttendees: 500,
    category: "Webinar",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    status: "Published",
  },
];

export default function EventsManagement() {
  const [events, setEvents] = useState(adminEventsData);
  const [view, setView] = useState<"grid" | "list">("grid");

  const toggleStatus = (id: number) => {
    setEvents(
      events.map((ev) =>
        ev.id === id
          ? { ...ev, status: ev.status === "Published" ? "Draft" : "Published" }
          : ev
      )
    );
  };

  const deleteEvent = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((ev) => ev.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#081f5c]">
            Event Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage, create, and monitor all platform events.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#081f5c] text-white rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-900/20 cursor-pointer">
          <Plus className="w-5 h-5" />
          Create New Event
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events by name, organizer, or location..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#ff6f00]/20 outline-none transition-all text-sm font-medium"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white shadow-sm text-[#081f5c]" : "text-gray-400 hover:text-gray-600"}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white shadow-sm text-[#081f5c]" : "text-gray-400 hover:text-gray-600"}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">
            <Filter className="w-4 h-4" /> Filter Status
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">
            <Clock className="w-4 h-4" /> Sort by Date
          </button>
        </div>
      </div>

      {/* Events Grid View */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-4xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#081f5c]/5 transition-all duration-300 flex flex-col relative"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm border ${
                    event.status === "Published"
                      ? "bg-green-100/90 text-green-700 border-green-200"
                      : event.status === "Draft"
                        ? "bg-gray-100/90 text-gray-700 border-gray-200"
                        : "bg-red-100/90 text-red-700 border-red-200"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              {/* Image Section */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm text-[#081f5c] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-[#081f5c] line-clamp-2 leading-snug group-hover:text-[#ff6f00] transition-colors">
                    {event.title}
                  </h3>
                  <div className="relative group/menu">
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <div className="wx-6 h-6 rounded-lg bg-[#ff6f00]/10 px-2 flex items-center justify-center text-[#ff6f00] font-bold text-[10px]">
                    ORG
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider truncate">
                    {event.organizer}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-[#ff6f00]" />
                    <span className="truncate">
                      {event.date} • {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-[#ff6f00]" />
                    <span className="truncate">{event.location}</span>
                  </div>

                  {/* Attendance Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Attendees
                      </span>
                      <span className="text-[#081f5c]">
                        {event.attendees} / {event.maxAttendees}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ff6f00] rounded-full"
                        style={{
                          width: `${(event.attendees / event.maxAttendees) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toggleStatus(event.id)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-[#efefef] text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {event.status === "Published" ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    {event.status === "Published" ? "Hide" : "Publish"}
                  </button>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="flex-1 flex items-center justify-center p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View Implementation */
        <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-[#f9fcff] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#081f5c] group-hover:text-[#ff6f00] transition-colors">
                          {event.title}
                        </h4>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-700">
                      {event.date}
                    </div>
                    <div className="text-xs text-gray-400">{event.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        event.status === "Published"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : event.status === "Draft"
                            ? "bg-gray-50 text-gray-700 border-gray-100"
                            : "bg-red-50 text-red-700 border-red-100"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          event.status === "Published"
                            ? "bg-green-500"
                            : event.status === "Draft"
                              ? "bg-gray-500"
                              : "bg-red-500"
                        }`}
                      ></span>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 w-24">
                      <div className="text-xs font-bold text-[#081f5c]">
                        {((event.attendees / event.maxAttendees) * 100).toFixed(
                          0
                        )}
                        %
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ff6f00] rounded-full"
                          style={{
                            width: `${(event.attendees / event.maxAttendees) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {event.attendees}/{event.maxAttendees}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                        title="View Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-[#081f5c] hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
