import NewSignUpForm from "@/components/auth/NewSignUpForm";
// import SignUpForm from "@/components/auth/SignUpForm";
import { BASE_URL } from "@/config";

export default function SignUpPage() {
  const checkDev = BASE_URL?.includes("dev");
  return <NewSignUpForm />;
}
