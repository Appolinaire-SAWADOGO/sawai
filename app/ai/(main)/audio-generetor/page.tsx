"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { UseRequestNumberExpiredModal } from "@/lib/actions/store/request-number-expired-modal";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { ArrowDownToLine, Loader2, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AudioPlayer } from "react-audio-play";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Typewriter from "typewriter-effect";
import TextareaAutosize from "react-textarea-autosize";
import { audioGenerateType } from "@/lib/type/data-type";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user, isLoaded } = useUser();
  const [prompt, setPrompt] = useState<string>();
  const [rended, setRended] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => setRended(true), []);

  const queryClient = useQueryClient();

  const { open } = UseRequestNumberExpiredModal();

  const { data } = useQuery<audioGenerateType>({
    queryKey: ["get-audio-data"],
    queryFn: async () =>
      axios.get("/api/get-audio-data").then((resp) => resp.data),
  });

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async () => {
      if (!prompt || isLoading || !isLoaded) return;
      setPrompt("");
      const data = await axios
        .post("/api/audio-generator", { prompt: prompt })
        .then((resp) => {
          if (resp.data.todayRequestNumberSupTen) {
            open();
            return;
          }

          router.refresh();
          return resp.data;
        });

      return data;
    },
    onSuccess: async () => {
      router.refresh();
      await queryClient.fetchInfiniteQuery(["get-audio-data"]);
      await queryClient.fetchInfiniteQuery(["today-request-number"]);
    },
  });

  if (!isLoaded || !rended) {
    return (
      <div className="w-full h-full flex items-center justify-center text-center">
        <Loader2 className="text-muted-foreground h-7 w-7 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-[20%] max-xl:px-[15%] max-lg:px-[15%] max-md:px-[10%] max-sm:px-6 h-full w-full relative">
      {data?.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="rounded-lg p-8 max-w-md w-full text-center">
            <h1 className="text-3xl font-semibold text-color mb-4">
              <Typewriter
                options={{
                  strings: ["You haven't generated any content yet."],
                  autoStart: true,
                  loop: true,
                  delay: 100,
                  deleteSpeed: 20,
                  cursorClassName: "text-muted-foreground",
                }}
              />
            </h1>
            <p className="text-muted-foreground mb-6">
              You haven&apos;t generated any content yet. Enter your prompt
              below to create one!
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="w-full h-[620px] max-lg:h-[550px] max-sm:h-[500px] border-none rounded-none whitespace-nowrap border">
          <div className="h-12"></div>
          <div className="flex flex-col gap-10 w-full">
            {data?.map((data, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-col h-auto bg-[#27282A] w-full p-5 rounded-lg font-normal",
                  data.who === "Ai" ? "bg-opacity-0 border-none" : "ml-auto"
                )}
              >
                <Avatar>
                  {!isLoaded && data.who === "YOU" ? (
                    <Skeleton className="w-full bg-[#d8d8d8] bg-opacity-25" />
                  ) : (
                    <>
                      <AvatarImage
                        src={data.who === "Ai" ? "" : user?.imageUrl}
                        alt="user image"
                      />
                      <AvatarFallback className="uppercase">
                        {data.who === "Ai" ? "ai" : user?.fullName?.slice(0, 2)}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>

                {data.who === "YOU" ? (
                  <p className="break-words whitespace-normal w-full mt-4 text-color opacity-70">
                    {data.content}
                  </p>
                ) : (
                  <div className="flex xl:w-4/5  w-full items-center gap-2 rounded-lg mt-8 bg-[#27282A] pr-3 py-2 bg-opacity-40">
                    <AudioPlayer
                      style={{
                        borderRadius: 2,
                        boxShadow: "none",
                        paddingBlock: 0,
                      }}
                      backgroundColor="transparent"
                      width={"90%"}
                      color="#BEBEBE"
                      sliderColor="#BEBEBE"
                      src={data.audioUrl}
                    />

                    <a
                      href={data.audioUrl}
                      download
                      className="flex text-[#BEBEBE] w-7 h-7 mb-1 cursor-pointer"
                      aria-label="Download Audio"
                    >
                      <ArrowDownToLine className="flex text-[#BEBEBE] w-7 h-7 mb-1 cursor-pointer" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            className={cn(
              "flex flex-col gap-10 w-full mb-12",
              !isLoading ? "h-12" : "mt-10"
            )}
          >
            {isLoading && (
              <>
                <div>
                  <Skeleton className="w-12 h-12 rounded-full mb-4 bg-[#d8d8d8] bg-opacity-25" />
                  <Skeleton
                    className={cn(
                      "flex flex-col h-24 bg-[#d8d8d8] bg-opacity-25 w-full p-5 rounded-lg font-normal"
                    )}
                  />
                </div>
                <div>
                  <Skeleton className="w-12 h-12 rounded-full mb-4 bg-[#d8d8d8] bg-opacity-25" />
                  <Skeleton
                    className={cn(
                      "flex flex-col h-24 bg-[#d8d8d8] bg-opacity-25 w-full p-5 rounded-lg font-normals"
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      )}

      <div className="w-full flex items-center justify-center absolute bottom-7  left-0 ">
        <div className="flex flex-col items-center max-sm:mx-6 h-auto w-[600px] max-sm:w-full bg-[#27282A] rounded-xl p-2">
          <div className="h-full w-full scrollBar">
            <TextareaAutosize
              maxRows={7}
              maxLength={1000}
              placeholder="Type your promt here."
              className="resize-none w-full outline-none border-none bg-transparent text-color text-sm px-3 pt-2 placeholder:text-muted-foreground"
              value={prompt}
              onChange={(value) => setPrompt(value.currentTarget.value)}
            />
          </div>
          <div
            className="w-full flex items-center justify-between px-2"
            onClick={() => {
              if (prompt?.length === 0) return;
              onSubmit();
            }}
          >
            <span
              className={cn(
                "flex text-color text-sm font-normal pl-1 opacity-60",
                prompt?.length === 1000 && "text-destructive font-bold"
              )}
            >
              You are {prompt?.length} length
            </span>

            <div className="flex items-center ml-auto justify-center h-10 w-10  bg-[#27282A]  active:bg-[#39393C] hover:bg-[#39393C] duration-100 cursor-pointer rounded-full">
              <Send className="text-color w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
