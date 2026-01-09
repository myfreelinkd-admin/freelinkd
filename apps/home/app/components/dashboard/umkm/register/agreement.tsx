"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Shield, FileText, Lock } from "lucide-react";

interface AgreementProps {
  onAgree?: (agreed: boolean) => void;
  isAgreed?: boolean;
}

export default function Agreement({ onAgree, isAgreed = false }: AgreementProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: "terms",
      title: "Terms of Service",
      icon: FileText,
      content: `
        By registering as an SME (UMKM) partner on Freelinkd, you agree to:

        1. **Account Responsibility**: You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.

        2. **Accurate Information**: You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.

        3. **Business Conduct**: You agree to conduct your business activities in compliance with all applicable laws and regulations.

        4. **Platform Usage**: You will use the Freelinkd platform solely for legitimate business purposes and in accordance with our guidelines.

        5. **Payment Terms**: You agree to pay all fees and charges associated with your account on time.

        6. **Intellectual Property**: You retain ownership of your content but grant Freelinkd a license to display and promote your business on our platform.
      `,
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: Lock,
      content: `
        Your privacy is important to us. Here's how we handle your data:

        1. **Data Collection**: We collect information you provide during registration, including business details, contact information, and transaction data.

        2. **Data Usage**: Your data is used to provide and improve our services, process transactions, and communicate with you about your account.

        3. **Data Protection**: We implement industry-standard security measures to protect your personal and business information.

        4. **Third-Party Sharing**: We do not sell your data. We may share information with service providers who assist in our operations.

        5. **Data Retention**: We retain your data as long as your account is active or as needed to provide services.

        6. **Your Rights**: You have the right to access, correct, or delete your personal data at any time.
      `,
    },
    {
      id: "partnership",
      title: "Partnership Agreement",
      icon: Shield,
      content: `
        As a Freelinkd SME partner, you acknowledge:

        1. **Service Standards**: You commit to maintaining high-quality standards in your products or services offered through the platform.

        2. **Customer Service**: You agree to respond to customer inquiries and resolve disputes in a professional manner.

        3. **Platform Fees**: You understand that Freelinkd may charge service fees for transactions conducted through the platform.

        4. **Account Verification**: You consent to our verification process to ensure the legitimacy of your business.

        5. **Compliance**: You agree to comply with all platform policies and guidelines, which may be updated from time to time.

        6. **Termination**: Either party may terminate this partnership with appropriate notice, subject to the completion of pending obligations.
      `,
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#081f5c] to-[#0a2a7a] p-6 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Terms & Agreements
          </h3>
          <p className="text-white/80 text-sm mt-1">
            Please review the following agreements before proceeding
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="divide-y divide-gray-100">
          {sections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <div key={section.id} className="bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#081f5c]/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#081f5c]" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      {section.title}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                      <div className="prose prose-sm text-gray-600 whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Agreement Checkbox */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => onAgree?.(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-[#081f5c] border-gray-300 rounded focus:ring-[#081f5c] cursor-pointer"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
              I have read and agree to the{" "}
              <strong className="text-[#081f5c]">Terms of Service</strong>,{" "}
              <strong className="text-[#081f5c]">Privacy Policy</strong>, and{" "}
              <strong className="text-[#081f5c]">Partnership Agreement</strong>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
