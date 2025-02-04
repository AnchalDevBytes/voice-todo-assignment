import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="h-screen w-full flex items-center">
      <div className="h-full flex-[2] border-r-[0.5px] border-r-slate-700 flex items-center justify-center ">
        banner
      </div>
      <div className="h-full flex-[1] flex items-center justify-center">
        {children}
      </div>
    </main>
  );
};

export default layout;
