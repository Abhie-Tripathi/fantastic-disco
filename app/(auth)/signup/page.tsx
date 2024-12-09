import NewSignUpForm from "@/components/auth/NewSignUpForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { BaseURL } from "@/config";

export default function SignUpPage() {
  const checkDev = BaseURL?.includes("dev");
  if (checkDev) {
    return <SignUpForm />;
  } else {
    return <SignUpForm />;
  }
}
