import Banner from "@/components/Banner";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="h-screen w-full flex items-center">
      <Banner />
      <div className="h-full flex-[1] flex items-center justify-center p-8">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
