import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Logo = ({
  className,
  spanClassName,
}: {
  className?: string;
  spanClassName?: string;
}) => {
  return (
    <Link href={"/"}>
      <div className="flex items-center gap-2">
        <i
          className={cn(
            "fa-solid fa-bolt sm:text-3xl text-2xl text-color",
            className
          )}
        ></i>
        <span
          className={cn(
            "sm:text-3xl text-2xl font-bold text-color",
            className,
            spanClassName
          )}
        >
          Sawai
        </span>
      </div>
    </Link>
  );
};

export default Logo;
