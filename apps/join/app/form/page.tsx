"use client";

import React, { useState, useEffect } from "react";
import Breadcrumbs from "../components/form/layout/breadcrumb";
import Header from "../components/form/layout/header";
import PersonalInfo from "../components/form/personal-info";
import ProfesionalInfo from "../components/form/profesional-info";
import Review from "../components/form/review";
import Results from "../components/form/results";
import { onFormFillEvent } from "../utils/assistant-join";

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

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-2 pl-[1cm]">
          <Breadcrumbs />
        </div>

        <Header
          currentStep={currentStep}
          totalSteps={3}
          showSteps={!showResults}
        />

        <div className="mt-6">
          {!showReview && !showResults ? (
            <>
              <PersonalInfo
                formData={formData}
                updateFormData={updateFormData}
              />
              <ProfesionalInfo
                formData={formData}
                updateFormData={updateFormData}
                onNext={() => setShowReview(true)}
              />
            </>
          ) : showResults ? (
            <Results
              data={{
                ...formData,
                resume: formData.resume
                  ? { name: formData.resume.name }
                  : undefined,
              }}
            />
          ) : (
            <Review
              data={{
                ...formData,
                resume: formData.resume
                  ? { name: formData.resume.name }
                  : undefined,
              }}
              onEdit={handleEdit}
              onSubmit={() => setShowResults(true)}
            />
          )}
        </div>
      </div>
    </main>
  );
}
