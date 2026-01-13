"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Breadcrumbs from "../components/form/layout/breadcrumb";
import Header from "../components/form/layout/header";
import PersonalInfo from "../components/form/personal-info";
import ProfesionalInfo from "../components/form/profesional-info";
import Review from "../components/form/review";
import Results from "../components/form/results";
import { onFormFillEvent } from "../utils/assistant-join";
import { submitFreelancerForm } from "../utils/freelancer-api";

interface FormData {
  name: string;
  address: string;
  email: string;
  phone: string;
  skills?: string;
  professionalExperience?: string;
  portfolioUrl?: string;
  resume?: File | null;
}

export default function FormPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    email: "",
    phone: "",
  });
  const [showReview, setShowReview] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // Handler untuk submit form ke AstraDB
  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let resumeUrl = "";

      // Upload resume file first if exists
      if (formData.resume) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.resume);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResult.success) {
          resumeUrl = uploadResult.data.url;
          console.log("✅ Resume uploaded:", resumeUrl);
        } else {
          console.error("Failed to upload resume:", uploadResult.message);
          // Continue without resume if upload fails
        }
      }

      // Submit form with resume URL
      const response = await submitFreelancerForm({
        name: formData.name,
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
        skills: formData.skills,
        professionalExperience: formData.professionalExperience,
        portfolioUrl: formData.portfolioUrl,
        resumeFileName: resumeUrl || formData.resume?.name, // Use URL if available
      });

      if (response.success) {
        setShowResults(true);
      } else {
        setSubmitError(response.message || "Failed to submit application");
        console.error("Submit error:", response.errors);
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred. Please try again.");
      console.error("Submit exception:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Listen for form fill events from chatbot
  useEffect(() => {
    const cleanup = onFormFillEvent((data) => {
      updateFormData(data);

      // Visual feedback: scroll to top and highlight
      if (typeof window !== "undefined") {
        // Scroll to top first
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Add a small delay then scroll to personal info section
        setTimeout(() => {
          const personalSection = document.querySelector(
            '[data-section="personal-info"]'
          );
          if (personalSection) {
            personalSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 300);
      }
    });

    return cleanup;
  }, []);

  const handleEdit = (section: "personal" | "project" | "professional") => {
    setShowReview(false);
    if (typeof window !== "undefined") {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const currentStep = showResults ? 3 : showReview ? 2 : 1;

  return (
    <main className="min-h-screen bg-[--background]">
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-2 pl-0 md:pl-8">
          <Breadcrumbs />
        </div>

        <Header
          currentStep={currentStep}
          totalSteps={3}
          showSteps={!showResults}
        />

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {!showReview && !showResults ? (
              <motion.div
                key="form-input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <PersonalInfo
                  formData={formData}
                  updateFormData={updateFormData}
                />
                <ProfesionalInfo
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={() => setShowReview(true)}
                />
              </motion.div>
            ) : showResults ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <Results
                  data={{
                    ...formData,
                    resume: formData.resume
                      ? { name: formData.resume.name }
                      : undefined,
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Review
                  data={{
                    ...formData,
                    resume: formData.resume
                      ? { name: formData.resume.name }
                      : undefined,
                  }}
                  onEdit={handleEdit}
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                  submitError={submitError}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
