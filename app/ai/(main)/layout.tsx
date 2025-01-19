import AiPageNavbar from "@/components/ui/main/ai-page-navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-screen">
      <AiPageNavbar />
      {children}
    </div>
  );
};

export default Layout;
