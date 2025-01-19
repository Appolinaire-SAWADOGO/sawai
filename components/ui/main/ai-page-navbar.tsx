"use client";

import React from "react";
import { Sidebar } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MainSidebar from "./sidebar";

const AiPageNavbar = () => {
  return (
    <>
      <div className="w-full pl-6 pt-3 pb-1 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Sidebar className="w-12 h-12 py-1 px-2 duration-100 hover:bg-[#39393C] cursor-pointer rounded-md text-color" />
          </SheetTrigger>
          <SheetContent className="p-0 border-none" side={"left"}>
            <MainSidebar isMobile />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default AiPageNavbar;
