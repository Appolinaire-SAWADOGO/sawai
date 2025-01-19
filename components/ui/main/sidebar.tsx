"use client";

import React from "react";
import Logo from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Progress } from "../progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../button";
import { useAuth, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Skeleton } from "../skeleton";
import axios from "axios";
import { useQuery } from "react-query";
import { requestNumberType } from "@/lib/type/request-number";

const sidebarData = [
  {
    titre: "Content generetor",
    icon: <span className="text-xl">✨</span>,
    link: "/ai/content-generetor",
  },
  {
    titre: "Audio generetor",
    icon: (
      <i className="fa-sharp fa-solid fa-circle-play text-[#BE2727] text-xl"></i>
    ),
    link: "/ai/audio-generetor",
  },
  {
    titre: "Image generetor",
    icon: <i className="fa-solid fa-image text-[#02B8F5] text-xl"></i>,
    link: "/ai/image-generetor",
  },
];

const MainSidebar = ({ isMobile }: { isMobile: boolean }) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const pathName = usePathname();

  const { data: todayRequestNumber } = useQuery<requestNumberType>({
    queryKey: ["today-request-number"],
    queryFn: async () =>
      await axios.get("/api/number-request").then((resp) => resp.data),
  });

  return (
    <div
      className={cn(
        " flex flex-col justify-between text-color min-w-80 bg-[#27282A] h-screen py-10 pr-4 pl-6 border-r border-[#58595A] overflow-y-auto",
        !isMobile && "max-lg:hidden"
      )}
    >
      <div>
        <Logo className="text-4xl w-auto" />
        <div className="mt-10 flex flex-col gap-1">
          {sidebarData.map((data, index) => (
            <Link key={index} href={data.link}>
              <div
                className={cn(
                  "w-full p-4 flex items-center gap-3 hover:bg-[#39393C] rounded-lg text-base font-medium",
                  pathName.includes(data.link) && "bg-[#39393C]"
                )}
              >
                {data.icon}
                {data.titre}
              </div>
            </Link>
          ))}
          <div
            className="flex flex-col gap-2 mt-4 p-4 w-full
          "
          >
            <div className="flex items-center justify-between text-color w-full font-medium">
              <span>Today</span>
              <span>
                {todayRequestNumber ? (
                  todayRequestNumber?.number
                ) : (
                  <>
                    <Skeleton className="w-3 h-2 bg-[#d8d8d8] bg-opacity-25" />
                  </>
                )}
              </span>
            </div>
            {todayRequestNumber ? (
              <Progress
                value={todayRequestNumber?.number * 10}
                max={100}
                className="h-2"
              />
            ) : (
              <Progress value={0} max={100} className="h-2" />
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex justify-between items-center gap-2 h-full px-4 py-3 bg-transparent border-none outline-none hover:bg-[#39393C] rounde-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="rounded-md">
                    {!isLoaded ? (
                      <Skeleton className="w-full bg-[#d8d8d8] bg-opacity-25" />
                    ) : (
                      <>
                        <AvatarImage
                          src={user?.imageUrl}
                          alt={user?.fullName as string}
                        />
                        <AvatarFallback>
                          {user?.fullName?.slice(0, 2)}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>

                  <div className="flex  items-start flex-col gap-1">
                    {!isLoaded ? (
                      <>
                        <Skeleton className="w-16 h-2 bg-[#d8d8d8] bg-opacity-25" />
                        <Skeleton className="w-24 h-2 bg-[#d8d8d8] bg-opacity-25" />
                      </>
                    ) : (
                      <>
                        <span className="text-color">
                          {user?.fullName?.slice(0, 17) ||
                            user?.username?.slice(0, 17)}
                          ...
                        </span>
                        <span className="text-color">
                          {user?.emailAddresses[0].emailAddress.slice(0, 16)}...
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronsUpDown className="w-10 h-10 text-color" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              className="w-full bg-[#27282A] border-[#58595A] p-0"
            >
              <DropdownMenuItem
                className="flex items-center gap-2 text-color py-3"
                onClick={() => signOut()}
              >
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Link
        href={"https://github.com/Appolinaire-SAWADOGO"}
        className="group pt-14"
      >
        <span className="text-color font-normal text-center max-sm:text-base flex items-center gap-2">
          <i className="fa-brands fa-github text-base"></i>
          <span className="group-hover:underline text-sm font-light">
            @Create by appolinaire sdg
          </span>
        </span>
      </Link>
    </div>
  );
};

export default MainSidebar;
