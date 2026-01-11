import { Suspense } from "react";
import FreelancerLogin from "@/app/components/login/freelancer/freelancer-login";

export default function FreelancerLoginPage() {
  return (
    <Suspense>
      <FreelancerLogin />
    </Suspense>
  );
}
