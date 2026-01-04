"use client";

import { Plus, Users, Calendar, ArrowRight } from "lucide-react";

export default function Group() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Community Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center gap-6 group hover:border-(--secondary)/20 transition-all duration-300">
        <div className="w-16 h-16 rounded-2xl bg-(--alternative)/50 flex items-center justify-center group-hover:bg-(--secondary)/10 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-(--secondary)" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-(--primary)">
            Create a new community
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Get a new information in community
          </p>
        </div>
        <button className="p-3 rounded-xl bg-(--alternative)/30 text-gray-400 group-hover:bg-(--primary) group-hover:text-white transition-all cursor-pointer">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Teamworks Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-(--secondary)/20 transition-all duration-300 cursor-pointer">
        <div className="w-20 h-20 rounded-3xl bg-(--alternative)/50 flex items-center justify-center mb-6 group-hover:bg-(--secondary)/10 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-(--primary)" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-(--primary) group-hover:text-(--secondary) transition-colors">
            Create a Group For Teamworks
          </h3>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            Collaborate with other freelancers on big projects
          </p>
        </div>
      </div>

      {/* Events Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:border-(--secondary)/20 transition-all duration-300">
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-(--primary) flex items-center gap-2">
                <Calendar className="w-5 h-5 text-(--secondary)" /> Events
              </h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                No Active Events
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              You have not joined the event to become a participant or
              volunteer.
            </p>
          </div>
          <div className="mt-4">
            <span className="text-(--secondary) text-sm font-bold cursor-pointer hover:underline flex items-center gap-1">
              Explore Events <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Decorative Icon */}
        <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-(--alternative)/20 group-hover:text-(--secondary)/5 transition-colors" />
      </div>
    </div>
  );
}
