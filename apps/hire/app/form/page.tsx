"use client";

import { useState } from "react";
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
  selectedFreelancer?: {
    id: string;
    name: string;
    skills: string;
    matchPercentage: number;
  };
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
  });

  const totalSteps = 3;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <main className="min-h-screen bg-[#f9fcff]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-2 pl-[1cm]">
          <Breadcrumbs />
        </div>

        <Header
          currentStep={step}
          totalSteps={totalSteps}
          showSteps={step < 3}
        />

        <div className="mt-6">
          {step === 1 && (
            <FirstPage
              onNext={nextStep}
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {step === 2 && (
            <SecondPage
              onBack={prevStep}
              onNext={nextStep}
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {step === 3 && <ReviewPage data={formData} />}
        </div>
      </div>
    </main>
  );
}
