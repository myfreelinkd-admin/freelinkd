"use client";

import { FormData } from "../../form/page";

interface ReviewSectionProps {
  data?: FormData;
}

export default function ReviewSection({ data }: ReviewSectionProps) {
  if (!data) return null;

  return (
    <div className="space-y-6 md:space-y-8 mb-8 md:mb-12">
      {/* Personal Information Review */}
      <section>
        <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6">
          Personal Information
        </h3>
        <div className="bg-white border border-[#081f5c] rounded-xl md:rounded-2xl p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs md:text-sm font-bold text-gray-500">
                Name or Business Name
              </p>
              <p className="text-gray-900 font-medium text-sm md:text-base">
                {data.name}
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-gray-500">
                Email
              </p>
              <p className="text-gray-900 font-medium text-sm md:text-base break-all">
                {data.email}
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-gray-500">
                Phone
              </p>
              <p className="text-gray-900 font-medium text-sm md:text-base">
                {data.phone}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Information Review */}
      <section>
        <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6">
          Project Information
        </h3>
        <div className="bg-white border border-[#081f5c] rounded-xl md:rounded-2xl p-4 md:p-6 space-y-4">
          <div>
            <p className="text-xs md:text-sm font-bold text-gray-500">
              Job Title
            </p>
            <p className="text-gray-900 font-medium text-sm md:text-base">
              {data.jobTitle}
            </p>
          </div>
          <div>
            <p className="text-xs md:text-sm font-bold text-gray-500">Skills</p>
            <p className="text-gray-900 font-medium text-sm md:text-base">
              {data.skills}
            </p>
          </div>
          <div>
            <p className="text-xs md:text-sm font-bold text-gray-500">
              Project Description
            </p>
            <p className="text-gray-900 font-medium whitespace-pre-wrap text-sm md:text-base">
              {data.projectDescription}
            </p>
          </div>
          {data.additionalRequirements && (
            <div>
              <p className="text-xs md:text-sm font-bold text-gray-500">
                Additional Requirements
              </p>
              <p className="text-gray-900 font-medium whitespace-pre-wrap text-sm md:text-base">
                {data.additionalRequirements}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
