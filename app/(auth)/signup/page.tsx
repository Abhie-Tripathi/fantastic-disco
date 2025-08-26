"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/context";
import { getValidPath } from "@/lib/utils";
import { LoadingPage } from "@/components/auth/loadingPage";
import GtmSignUpForm from "@/components/auth/Gtm/GtmSignUpForm";
import TeliSignUpForm from "@/components/auth/Teli/TeliSignUpForm";
import { isEventeli } from "@/config";

export default function SignUpPage() {
  const params = useSearchParams();
  const redirectParams = params.get("redirect");
  const redirectPath = redirectParams ? getValidPath(redirectParams) : null;
  const router = useRouter();
  const { user, isAuthenticating } = useAuthContext();

  useEffect(() => {
    if (user && !isAuthenticating) {
      const redirectTo = redirectPath ? `/internal/${redirectPath}` : "/internal";
      router.replace(redirectTo);
    }
  }, [user, isAuthenticating, redirectPath, router]);

  if (user && !isAuthenticating) {
    return <LoadingPage />;
  }

  return isEventeli ? <TeliSignUpForm /> : <GtmSignUpForm />;
}
