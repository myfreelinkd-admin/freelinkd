"use client";

import { FormData } from "../../form/page";

interface ReviewSectionProps {
  data?: FormData;
}

export default function ReviewSection({ data }: ReviewSectionProps) {
  if (!data) return null;

  return (
    <div className="space-y-8 mb-12">
      {/* Personal Information Review */}
      <section>
        <h3 className="text-xl font-bold text-center mb-6">
          Personal Information
        </h3>
        <div className="bg-white border border-[#081f5c] rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-bold text-gray-500">
                Name or Business Name
              </p>
              <p className="text-gray-900 font-medium">{data.name}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Email</p>
              <p className="text-gray-900 font-medium">{data.email}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Phone</p>
              <p className="text-gray-900 font-medium">{data.phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Information Review */}
      <section>
        <h3 className="text-xl font-bold text-center mb-6">
          Project Information
        </h3>
        <div className="bg-white border border-[#081f5c] rounded-2xl p-6 space-y-4">
          <div>
            <p className="text-sm font-bold text-gray-500">Job Title</p>
            <p className="text-gray-900 font-medium">{data.jobTitle}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Skills</p>
            <p className="text-gray-900 font-medium">{data.skills}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">
              Project Description
            </p>
            <p className="text-gray-900 font-medium whitespace-pre-wrap">
              {data.projectDescription}
            </p>
          </div>
          {data.additionalRequirements && (
            <div>
              <p className="text-sm font-bold text-gray-500">
                Additional Requirements
              </p>
              <p className="text-gray-900 font-medium whitespace-pre-wrap">
                {data.additionalRequirements}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
