"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Signin = dynamic(() => import("@/components/Signin"), { suspense: true });

export default function SigninWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Signin />
    </Suspense>
  );
}
