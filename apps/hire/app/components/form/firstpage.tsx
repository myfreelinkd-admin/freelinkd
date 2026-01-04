"use client";

import { Button } from "@repo/ui/button";
import { FormData } from "../../form/page";

interface FirstPageProps {
  onNext?: () => void;
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
}

export default function FirstPage({
  onNext,
  formData,
  updateFormData,
}: FirstPageProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNext) onNext();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4">
      {/* Header Text */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Tell Us About Your Project
        </h2>
        <p className="text-gray-600">
          Help us understand your project requirements and business needs
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Personal Information Section */}
        <section>
          <h3 className="text-xl font-bold text-center mb-6">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">
                Name or Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                placeholder="enter your full name or business name"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                  placeholder="081234567890"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Project Information Section */}
        <section>
          <h3 className="text-xl font-bold text-center mb-6">
            Project Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400"
                placeholder="Enter Job Title (e.g. UI/UX Design)"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 resize-none"
                placeholder="Describe your project requirements, goals, timeline, and any specific needs..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">
                Additional Requirements
              </label>
              <textarea
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleChange}
                rows={4}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 resize-none"
                placeholder="Any additional information or special requirements..."
              />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button className="bg-[#ff6f00] hover:bg-[#e66400] text-white px-10 py-3 text-base font-semibold cursor-pointer">
            Continue to Review
          </Button>
        </div>
      </form>
    </div>
  );
}
