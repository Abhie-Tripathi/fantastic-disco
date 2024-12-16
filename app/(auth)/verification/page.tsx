"use client";
import NewSignUpForm from "@/components/auth/NewSignUpForm";
import NewVerificationForm from "@/components/auth/NewVerification";
import NewVerification from "@/components/auth/NewVerification";
import SignUpForm from "@/components/auth/SignUpForm";
import VerificationForm from "@/components/auth/Verification";
import { BaseURL } from "@/config";
import { VerificationProps } from "@/types/onboarding";

const Verification: React.FC<VerificationProps> = ({ params }) => {
  const checkDev = BaseURL?.includes("dev");

  if (checkDev) {
    return <NewVerification params={params} />;
  } else {
    return <VerificationForm params={params} />;
  }
};

export default Verification;
