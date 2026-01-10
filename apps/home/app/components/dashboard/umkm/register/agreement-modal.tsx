"use client";

import { X, Info, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function AgreementModal({
  isOpen,
  onClose,
  onAccept,
}: AgreementModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Use a safety check for document to avoid SSR errors
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#081f5c]/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-4xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-[#081f5c]">
              Key Terms of Service
            </h2>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Please read these essential points before continuing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Welcome Info Box */}
          <div className="bg-[#081f5c]/5 border border-[#081f5c]/10 rounded-2xl p-5 flex gap-4">
            <div className="shrink-0">
              <AlertCircle className="w-6 h-6 text-[#081f5c]" />
            </div>
            <div>
              <h3 className="font-bold text-[#081f5c] text-sm mb-1">
                Welcome to Freelinkd
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Before you start hiring, please read and accept these key points
                to ensure safe, transparent, and successful collaborations on
                our platform.
              </p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-bold text-gray-800 text-sm">
                Our Role as a Platform
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Freelinkd is a marketplace that connects you with independent
                freelancers. We are not an employer, and the service contract
                for any project is directly between you (the SME) and the
                freelancer.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-gray-800 text-sm">
                Your Responsibility
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                You are solely responsible for interviewing, selecting, and
                managing the freelancers you hire. Freelinkd does not guarantee
                the quality or outcome of a freelancer&apos;s work.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-gray-800 text-sm">Payments</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                You agree to make all payments for freelancer services
                exclusively through the Freelinkd platform. This ensures a
                secure transaction and accurate records. Our service fees will
                be clearly stated and applied to each payment.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-gray-800 text-sm">
                Work Ownership
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Upon your final payment for a project, you will own the
                intellectual property of the work delivered by the freelancer,
                unless otherwise agreed upon in your direct contract with them.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-gray-800 text-sm">Disputes</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Should an issue arise, you agree to first attempt to resolve it
                directly with the freelancer. Freelinkd provides a dispute
                resolution process to assist if a mutual agreement cannot be
                reached.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-gray-800 text-sm">No Guarantees</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                The platform is provided &quot;as is.&quot; Freelinkd is not
                liable for any damages or losses related to the services
                provided by freelancers.
              </p>
            </div>
          </div>

          {/* Acknowledgement Box */}
          <div className="bg-[#081f5c]/5 border border-[#081f5c]/10 rounded-2xl p-5 flex gap-4 mt-4">
            <div className="shrink-0">
              <Info className="w-5 h-5 text-[#081f5c]" />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              By clicking &quot;Accept & Continue&quot;, you acknowledge that
              you have read, understood, and agree to be bound by these key
              points.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 z-10">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={onAccept}
            className="px-8 py-3 rounded-xl bg-[#081f5c] text-white text-sm font-bold hover:bg-[#0a2a7a] transition-all shadow-lg shadow-[#081f5c]/20 hover:shadow-[#081f5c]/30 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
