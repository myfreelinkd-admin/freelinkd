import Image from "next/image";

interface HeaderProps {
  currentStep?: number;
  totalSteps?: number;
  showSteps?: boolean;
}

export default function Header({
  currentStep = 1,
  totalSteps = 2,
  showSteps = true,
}: HeaderProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <header className="bg-[#081f5c] text-white px-8 py-6 rounded-3xl flex flex-col md:flex-row items-center justify-between shadow-lg gap-4 md:gap-0">
        <div className="flex items-center gap-4 md:gap-8 width-full md:w-auto justify-between md:justify-start">
          {/* Logo */}
          <div className="shrink-0">
            <Image
              src="/assets/freelinkd.svg"
              alt="Freelinkd Logo"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">
              Hire Freelancer
            </h1>
            <p className="text-gray-300 text-xs md:text-sm mt-0.5">
              Share your project information
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        {showSteps && (
          <div className="text-lg font-medium self-end md:self-auto">
            Step {currentStep} of {totalSteps}
          </div>
        )}
      </header>
    </div>
  );
}
