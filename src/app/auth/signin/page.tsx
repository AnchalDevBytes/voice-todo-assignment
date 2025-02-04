"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const Signin = () => {
  const params = useSearchParams();
  useEffect(() => {
    toast.error(params?.get("message"));
  }, []);

  return <div>Signin</div>;
};

export default Signin;
