"use client";

import { useState } from "react";
import { Calendar, Star, Medal, Search } from "lucide-react";
import ProjectModals from "./modals/project-modals";

export default function Greetings() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Left Section: Welcome & Freelancer Info */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
        {/* Decorative Background Element */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-(--secondary)/5 rounded-full blur-3xl group-hover:bg-(--secondary)/10 transition-colors duration-500"></div>

        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-(--primary) tracking-tight">
              Welcome Back,{" "}
              <span className="text-(--secondary)">Freelancer 1</span>
            </h1>
            <p className="text-gray-400 mt-1 font-medium">
              Have a Nice Day! Let&apos;s find your next big project today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {/* Date Info */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-(--alternative)/50 border border-gray-50 hover:border-(--secondary)/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-(--primary)" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  Today
                </p>
                <p className="text-sm font-bold text-(--primary)">
                  Wed, 21 Oct 2025
                </p>
              </div>
            </div>

            {/* Rank Info */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-(--alternative)/50 border border-gray-50 hover:border-(--secondary)/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Star className="w-5 h-5 text-(--primary)" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  Rank
                </p>
                <p className="text-sm font-bold text-(--primary)">Bronze</p>
              </div>
            </div>

            {/* Skills Info */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-(--alternative)/50 border border-gray-50 hover:border-(--secondary)/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Medal className="w-5 h-5 text-(--primary)" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                  Expertise
                </p>
                <p className="text-sm font-bold text-(--primary)">
                  Web Dev, Mobile Dev
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Find Projects CTA */}
      <div className="bg-(--primary) rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4"></div>

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">
              Ready for a new challenge?
            </h2>
            <p className="text-white/60 text-sm mt-3 font-medium">
              Browse thousands of projects and start earning today.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 bg-(--secondary) hover:bg-(--secondary)/90 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-(--secondary)/20 mt-6 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Find Projects
          </button>
        </div>

        {/* Abstract Pattern */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Project Modal */}
      <ProjectModals
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
