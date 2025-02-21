"use client"; // Mark this as a Client Component
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page({ searchParams}:any) {
  const { email, otp, target, targetId } = searchParams;
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const verifyAccess = async () => {
      const response = await fetch(
        "https://api.dev.gtm.whr.ai/auth/verify-access",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, target, targetId }),
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      // Extract the Set-Cookie header from the response
      const setCookieHeader = response.headers.get("Set-Cookie");
      console.log("Set-Cookie Header:", setCookieHeader);

      if (setCookieHeader) {
        // Extract the cookie value
        const cookieValue = setCookieHeader.split("=")[1].split(";")[0];

        // Set the cookie in the browser
        document.cookie = `dev=${cookieValue}; path=/; ${
          process.env.NODE_ENV === "production" ? "secure" : ""
        }`;
        console.log("Cookie set:", `dev=${cookieValue}`);
      }

      if (response.ok) {
        const setCookieHeader = response.headers.get("Set-Cookie");
      console.log("Set-Cookie Header:", setCookieHeader);
        // Redirect using Next.js router
        router.push("/internal/trackers?tab=allTrackers&skip=0");
      }

      setData(result);
    };

    verifyAccess();
  }, [email, otp, target, targetId, router]);

  return (
    <div>
      {/* <h2>API Response:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}