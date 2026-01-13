"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "../components/form/layout/header";
import Breadcrumbs from "../components/form/layout/breadcrumbs";
import FirstPage from "../components/form/firstpage";
import SecondPage from "../components/form/secondpage";
import ReviewPage from "../components/form/results";

export interface FormData {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  skills: string;
  projectDescription: string;
  additionalRequirements: string;
  dueTime: string;
  deadlineDate: string;
  budgetFrom: string;
  budgetTo: string;
  uploadDocument: File | null;
  jobStatus: "general" | "assigned";
  selectedFreelancer?: {
    id: string;
    name: string;
    skills: string;
    matchPercentage: number;
  } | null;
}

export default function FormPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    skills: "",
    projectDescription: "",
    additionalRequirements: "",
    dueTime: "",
    deadlineDate: "",
    budgetFrom: "",
    budgetTo: "",
    uploadDocument: null,
    jobStatus: "assigned",
    selectedFreelancer: null,
  });

  const totalSteps = 3;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const name = searchParams.get("name");
      const email = searchParams.get("email");
      const phone = searchParams.get("phone");

      if (name || email || phone) {
        setFormData((prev) => ({
          ...prev,
          name: name || prev.name,
          email: email || prev.email,
          phone: phone || prev.phone,
        }));
      }
    }
  }, []);

  return (
    <motion.main
      className="min-h-screen bg-[#f9fcff]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-2 pl-0 md:pl-8">
          <Breadcrumbs />
        </div>

        <Header
          currentStep={step}
          totalSteps={totalSteps}
          showSteps={step < 3}
        />

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <FirstPage
                  onNext={nextStep}
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <SecondPage
                  onBack={prevStep}
                  onNext={nextStep}
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ReviewPage data={formData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.main>
  );
}
