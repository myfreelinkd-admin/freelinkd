"use client";

import { useState } from "react";
import { sanitizeInput } from "@/app/utils/sanitize";

export const useReportForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Sanitize inputs
      const sanitizedData = {
        fullName: sanitizeInput(formData.fullName),
        email: sanitizeInput(formData.email),
        description: sanitizeInput(formData.description),
      };

      // Validate inputs
      if (!sanitizedData.fullName || !sanitizedData.email || !sanitizedData.description) {
        throw new Error("Please fill in all required fields");
      }

      // WhatsApp support number
      const supportNumber = "628159998281";

      // Professional English message template
      const message = `
*FREELINKD SUPPORT REQUEST*
━━━━━━━━━━━━━━━━━━━━━━

Hello Freelinkd Admin,

I am reaching out to report an issue with my account.

*Contact Details:*
• Name: ${sanitizedData.fullName}
• Email: ${sanitizedData.email}

*Issue Description:*
${sanitizedData.description}

━━━━━━━━━━━━━━━━━━━━━━
Submitted via Freelinkd Support Form
      `.trim();

      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${supportNumber}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      setSuccess(true);
      setFormData({ fullName: "", email: "", description: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
  };
};

