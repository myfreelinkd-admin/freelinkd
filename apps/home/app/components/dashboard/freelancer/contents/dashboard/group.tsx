"use client";

import { useState, useEffect } from "react";
import { Plus, Users, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import GroupModal from "./modals/group-modals";

import GroupDetailsModal from "./group-details";

export default function Group() {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [myGroup, setMyGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchGroup = async () => {
    try {
      const storage = localStorage.getItem("freelancer_user") ? localStorage : sessionStorage;
      const storedUser = storage.getItem("freelancer_user");
      let id = "";
      
      if (storedUser) {
         const parsedUser = JSON.parse(storedUser);
         id = parsedUser.id;
         setUserId(id);
      }

      if (!id) return;

      const response = await fetch(`/api/freelancer/group?freelancerId=${id}`);
      if (response.ok) {
         const data = await response.json();
         if (data.success && data.data) {
           setMyGroup(data.data);
         } else {
            setMyGroup(null);
         }
      }
    } catch (error) {
      console.error("Failed to fetch group:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Community Card */}
        <Link
          href="/freelancer/community"
          className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center gap-6 group hover:border-(--secondary)/20 transition-all duration-300 cursor-pointer"
        >
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
          <div className="p-3 rounded-xl bg-(--alternative)/30 text-gray-400 group-hover:bg-(--secondary) group-hover:text-white transition-all">
            <ArrowRight className="w-5 h-5" />
          </div>
        </Link>

        {/* Teamworks Card / My Group Card */}
        {loading ? (
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Loading...</span>
             </div>
        ) : myGroup ? (
            <div 
              onClick={() => setIsDetailsOpen(true)}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-start justify-center group hover:border-(--secondary)/20 transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-4 z-10">
                 <div className="w-14 h-14 rounded-2xl bg-(--secondary)/10 flex items-center justify-center text-(--secondary)">
                    <Users className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-(--primary) line-clamp-1">
                      {myGroup.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      Member: {myGroup.members.length + 1} / {myGroup.maxMembers}
                    </p>
                 </div>
              </div>
              
              {/* Skills */}
              {myGroup.skills && myGroup.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 z-10 mb-3">
                  {myGroup.skills.slice(0, 3).map((skill: string) => (
                    <span
                      key={skill}
                      className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {myGroup.skills.length > 3 && (
                    <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">
                      +{myGroup.skills.length - 3}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 z-10 line-clamp-2 mb-2">
                  Collaborating on projects with your team.
                </p>
              )}
                <div className="flex -space-x-2 z-10 mt-auto">
                    {/* Me */}
                    {userId && (() => {
                        const allMembers = [myGroup.ownerDetails, ...(myGroup.memberDetails || [])];
                        const me = allMembers.find((m: any) => m.id === userId);
                        return (
                            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-orange-100 overflow-hidden relative shadow-sm" title="You">
                                {me?.avatar ? (
                                    <img src={me.avatar} alt="Me" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] font-bold text-orange-500">You</span>
                                )}
                            </div>
                        );
                    })()}

                    {/* Others */}
                    {[myGroup.ownerDetails, ...(myGroup.memberDetails || [])]
                        .filter((m: any) => m.id !== userId)
                        .slice(0, 4)
                        .map((m: any, i: number) => (
                             <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-blue-100 overflow-hidden relative shadow-sm" title={m.name}>
                                 {m.avatar ? (
                                    <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                                 ) : (
                                    <span className="text-[10px] font-bold text-blue-500">{m.name?.charAt(0) || "M"}</span>
                                 )}
                             </div>
                    ))}
                    
                    {/* Overflow indicator if needed */}
                     {[myGroup.ownerDetails, ...(myGroup.memberDetails || [])].length > 5 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-gray-50 text-[10px] text-gray-500 font-bold">
                            +{[myGroup.ownerDetails, ...(myGroup.memberDetails || [])].length - 5}
                        </div>
                    )}
                </div>
               
               <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-(--alternative)/20 group-hover:text-(--secondary)/5 transition-colors" />
            </div>
        ) : (
            <div
              onClick={() => setIsGroupModalOpen(true)}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:border-(--secondary)/20 transition-all duration-300 cursor-pointer"
            >
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
        )}

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
              <Link
                href="/freelancer/events"
                className="text-(--secondary) text-sm font-bold cursor-pointer hover:underline flex items-center gap-1 w-fit"
              >
                Explore Events <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Decorative Icon */}
          <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-(--alternative)/20 group-hover:text-(--secondary)/5 transition-colors" />
        </div>
      </div>

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onSuccess={fetchGroup}
      />

      <GroupDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        group={myGroup}
        onLeave={fetchGroup}
      />
    </>
  );
}
