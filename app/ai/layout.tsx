import MainSidebar from "@/components/ui/main/sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-screen">
      <MainSidebar isMobile={false} />
      {children}
    </div>
  );
};

export default Layout;
