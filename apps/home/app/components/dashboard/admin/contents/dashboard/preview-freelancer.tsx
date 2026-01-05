"use client";

import { MoreHorizontal, Star, MapPin, Mail, ExternalLink } from "lucide-react";

const freelancers = [
  {
    id: 1,
    name: "Farhan Rasendriya",
    role: "UI/UX Designer",
    location: "Jakarta, ID",
    rating: 4.9,
    email: "farhan@example.com",
  },
  {
    id: 2,
    name: "Ilham Ramadhan",
    role: "Fullstack Developer",
    location: "Bandung, ID",
    rating: 4.8,
    email: "ilham@example.com",
  },
  {
    id: 3,
    name: "Alvin",
    role: "Graphic Designer",
    location: "Surabaya, ID",
    rating: 4.7,
    email: "alvin@example.com",
  },
];

export default function PreviewFreelancer() {
  return (
    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-(--primary)">
            Freelancer list are here!
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Overview of all registered freelancers on the platform.
          </p>
        </div>
        <button className="px-6 py-2.5 bg-(--alternative) hover:bg-(--secondary) hover:text-white text-(--primary) rounded-xl text-sm font-bold transition-all cursor-pointer">
          View All Freelancers
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
              <th className="px-4 pb-2">Freelancer Name</th>
              <th className="px-4 pb-2">Role / Expertise</th>
              <th className="px-4 pb-2">Location</th>
              <th className="px-4 pb-2">Rating</th>
              <th className="px-4 pb-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {freelancers.map((freelancer) => (
              <tr
                key={freelancer.id}
                className="group hover:bg-(--alternative)/30 transition-colors"
              >
                <td className="px-4 py-5 bg-(--alternative)/20 first:rounded-l-2xl group-hover:bg-transparent border-y border-l border-transparent group-hover:border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-(--secondary)/10 flex items-center justify-center text-(--secondary) font-bold text-sm border border-(--secondary)/10">
                      {freelancer.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-(--primary) text-sm">
                        {freelancer.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {freelancer.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                  <span className="text-sm text-gray-600 font-bold">
                    {freelancer.role}
                  </span>
                </td>
                <td className="px-4 py-5 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                    <MapPin className="w-4 h-4 text-(--secondary)" />
                    {freelancer.location}
                  </div>
                </td>
                <td className="px-4 py-5 bg-(--alternative)/20 group-hover:bg-transparent border-y border-transparent group-hover:border-gray-100">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-(--primary)">
                      {freelancer.rating}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-5 bg-(--alternative)/20 last:rounded-r-2xl group-hover:bg-transparent border-y border-r border-transparent group-hover:border-gray-100 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2.5 bg-white hover:bg-gray-50 rounded-xl transition-all text-gray-400 shadow-sm border border-gray-100 cursor-pointer group/btn">
                      <ExternalLink className="w-4 h-4 group-hover:text-(--secondary) transition-colors" />
                    </button>
                    <button className="p-2.5 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-(--primary) shadow-sm border border-transparent hover:border-gray-100 cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
