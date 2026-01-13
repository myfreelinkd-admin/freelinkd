"use client";

import React from "react";
import { sanitizeInput } from "../../utils/sanitize";

interface PersonalInfoData {
  name: string;
  address: string;
  email: string;
  phone: string;
}

interface PersonalInfoProps {
  formData: PersonalInfoData;
  updateFormData: (newData: Partial<PersonalInfoData>) => void;
}

export default function PersonalInfo({
  formData,
  updateFormData,
}: PersonalInfoProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    updateFormData({
      [name]: sanitizeInput(value),
    } as Partial<PersonalInfoData>);
  };

  return (
    <div
      className="w-full max-w-3xl mx-auto py-8 md:py-12 px-2 md:px-4"
      data-section="personal-info"
    >
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Tell Us About Yourself
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Help us understand your background and expertise
        </p>
      </div>

      <section>
        <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6">
          Personal Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 text-sm md:text-base"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 text-sm md:text-base"
              placeholder="Enter your city and country (e.g. Jakarta, Indonesia)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 text-sm md:text-base"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:bg-white focus:border-[#081f5c] focus:ring-4 focus:ring-[#081f5c]/10 outline-none transition-all duration-300 placeholder:text-gray-400 text-sm md:text-base"
                placeholder="081234567890"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
