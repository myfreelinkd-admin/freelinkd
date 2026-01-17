"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface FeedbackQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

export default function FeedbackQuestionModal({
  isOpen,
  onClose,
  project,
}: FeedbackQuestionModalProps) {
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [suggestion, setSuggestion] = useState("");
  const [existingFeedbackId, setExistingFeedbackId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (isOpen && (project?.id || project?._id)) {
      const fetchFeedback = async () => {
        try {
          const projectId = project.id || project._id;
          const res = await fetch(`/api/umkm/feedback?projectId=${projectId}`);
          const data = await res.json();

          if (data.success && data.data) {
            const feedback = data.data;
            setExistingFeedbackId(feedback._id);
            setSuggestion(feedback.suggestion || "");
            if (feedback.ratings) {
              setAnswers({
                1: feedback.ratings.deliverables || 0,
                2: feedback.ratings.communication || 0,
                3: feedback.ratings.timeliness || 0,
                4: feedback.ratings.professionalism || 0,
                5: feedback.ratings.matchQuality || 0,
                6: feedback.ratings.hireAgain || 0,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching feedback:", error);
        }
      };

      fetchFeedback();
    } else {
      // Reset state when closed or no project
      setAnswers({});
      setSuggestion("");
      setExistingFeedbackId(null);
    }
  }, [isOpen, project]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Transform answers object to array for API
      // API expects ratings array: [deliverables, communication, timeliness, professionalism, matchQuality, hireAgain]
      // questions are 1-indexed, so we map 1->0, 2->1, etc.
      const ratingsArray = [
        answers[1] || 0,
        answers[2] || 0,
        answers[3] || 0,
        answers[4] || 0,
        answers[5] || 0,
        answers[6] || 0,
      ];

      const res = await fetch("/api/umkm/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project?.id || project?._id,
          ratings: ratingsArray,
          suggestion,
          freelancerId: project?.freelancerId,
          // If we don't have umkmEmail in project, the API might handle it or we might need it.
          // Assuming project object has it or backend session handles it if missing.
          // Including it if available in project.
          umkmEmail: project?.umkmEmail,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Success handling
        onClose();
        // Ideally trigger a refresh or toast here
      } else {
        console.error("Submission failed:", data.error);
        // Optionally handle error state here
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const questions = [
    {
      id: 1,
      text: "The freelancer’s deliverables met my initial needs and expectations.",
      required: true,
    },
    {
      id: 2,
      text: "The freelancer communicated clearly and effectively during the project.",
      required: true,
    },
    {
      id: 3,
      text: "The freelancer completed the work on time as agreed.",
      required: true,
    },
    {
      id: 4,
      text: "The freelancer responded professionally to feedback or revision requests.",
      required: true,
    },
    {
      id: 5,
      text: "Freelinkd matched me with a relevant and suitable freelancer.",
      required: true,
    },
    {
      id: 6,
      text: "I would hire this freelancer again for a future project.",
      required: true,
    },
  ];

  const scaleItems = [
    {
      value: 1,
      label: "Very Poor",
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      value: 2,
      label: "Poor",
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      value: 3,
      label: "Neutral",
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    },
    {
      value: 4,
      label: "Good",
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      value: 5,
      label: "Excellent",
      color: "bg-teal-50 text-teal-600 border-teal-200",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Give Feedback</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section className="p-6 border border-yellow-100 rounded-xl bg-orange-50/30">
            <div className="w-full text-left">
              <h3 className="mb-4 text-lg font-bold text-amber-900">
                Rating Scale
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {scaleItems.map((item) => (
                <div
                  key={item.value}
                  className={`flex flex-col items-center justify-center p-4 bg-white border rounded-xl shadow-sm ${item.color} border-opacity-50`}
                >
                  <span className={`text-2xl font-black mb-1`}>
                    {item.value}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-start w-full px-6 py-3 mb-6 border-l-4 border-(--primary) bg-(--primary)/5 rounded-lg">
              <h3 className="text-lg font-bold text-left text-(--primary)">
                Question & Feedback
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-6 transition-all bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200"
                >
                  <div className="flex gap-4 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 text-sm font-bold text-(--primary) bg-(--primary)/5 rounded-full shrink-0">
                      {q.id}
                    </span>
                    <p className="text-base font-medium text-gray-800 pt-1">
                      {q.text}{" "}
                      {q.required && <span className="text-red-500">*</span>}
                    </p>
                  </div>

                  <div className="flex items-center justify-between max-w-2xl px-2 ml-12">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Very Poor
                    </span>
                    <div className="flex items-center gap-6 md:gap-8">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <label
                          key={val}
                          className="flex flex-col items-center gap-2 cursor-pointer group"
                        >
                          <div className="relative flex items-center justify-center">
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={val}
                              required={q.required}
                              checked={answers[q.id] === val}
                              onChange={() => handleRatingChange(q.id, val)}
                              className="w-5 h-5 text-(--primary) transition-all border-gray-300 focus:ring-(--primary) cursor-pointer"
                            />
                          </div>
                          <span
                            className={`text-sm font-medium transition-colors ${answers[q.id] === val ? "text-(--primary) font-bold" : "text-gray-400 group-hover:text-gray-600"}`}
                          >
                            {val}
                          </span>
                        </label>
                      ))}
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Excellent
                    </span>
                  </div>
                </div>
              ))}

              {/* Suggestions */}
              <div className="p-6 transition-all bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200">
                <div className="flex gap-4 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 text-sm font-bold text-(--primary) bg-(--primary)/5 rounded-full shrink-0">
                    7
                  </span>
                  <label
                    htmlFor="suggestion"
                    className="pt-1 text-base font-medium text-left text-gray-800"
                  >
                    What suggestions do you have to improve collaboration
                    between SMEs and freelancers on Freelinkd? (Optional)
                  </label>
                </div>
                <div className="ml-12">
                  <textarea
                    id="suggestion"
                    rows={4}
                    className="w-full p-4 text-gray-700 transition-all bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 outline-none resize-none"
                    placeholder="Type your suggestions here..."
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-600 transition-colors bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    Object.keys(answers).length < 6 ||
                    !!existingFeedbackId
                  }
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white transition-all bg-(--primary) rounded-xl hover:bg-(--primary)/90 hover:shadow-lg hover:shadow-(--primary)/20 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {existingFeedbackId
                    ? "Feedback Submitted"
                    : "Submit Feedback"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
