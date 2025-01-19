import React, { ReactNode } from "react";
import { Card } from "../card";
import { cn } from "@/lib/utils";

type LandingCardProps = {
  icon: ReactNode;
  bgColor: string;
  titre: string;
};

const LandingCard = ({ icon, bgColor, titre }: LandingCardProps) => {
  return (
    <Card className="bg-[#27282a] border opacity-90 border-[#616264] max-w-96 min-[762px]:w-80  p-5">
      <div
        className={cn(
          "w-20 h-16 flex items-center justify-center rounded-lg text-color ",
          bgColor
        )}
      >
        {icon}
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <h2 className="text-color font-bold text-xl">{titre} generator</h2>
        <p className="text-base font-light text-[#89898A]">
          AI Chat Assistant app! Easily create chate convenience of a
          personalized AI experience
        </p>
      </div>
    </Card>
  );
};

export default LandingCard;
