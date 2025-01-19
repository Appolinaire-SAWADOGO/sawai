import React from "react";
import Logo from "./logo";
import { Button } from "../button";
import Link from "next/link";

const LandingPageNavbar = () => {
  return (
    <div className="flex items-center justify-between bg-[#27282A] max-w-4xl m-auto sm:py-5 py-4 px-4 sm:px-10 rounded-lg border-[#616264] border border-opacity-90">
      <Logo />
      <Link href={"/auth/signin"}>
        <Button className="rounded-full bg-[#39393c] sm:px-5 px-4 sm:text-base text-sm sm:py-4 py-0 border boorder border-[#616264] border-opacity-90 text-color">
          Login
        </Button>
      </Link>
    </div>
  );
};

export default LandingPageNavbar;
