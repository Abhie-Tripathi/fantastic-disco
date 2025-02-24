import GtmSignUpForm from "@/components/auth/Gtm/GtmSignUpForm";
import TeliSignUpForm from "@/components/auth/Teli/TeliSignUpForm";
import { isEventeli } from "@/config";

export default function SignUpPage() {
  return isEventeli ? <TeliSignUpForm /> : <GtmSignUpForm />;
}
