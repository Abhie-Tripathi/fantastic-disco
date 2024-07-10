"use client";

import { useLayoutEffect } from "react";
import EmployeePage from "./employee/page";
import {  useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useLayoutEffect(() => {
    router.replace("/internal");
  });
  return (
    <main>
      <EmployeePage />
    </main>
  );
}
