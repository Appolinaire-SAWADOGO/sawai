import { Who } from "@prisma/client";

export type contentGenerateType = {
  who: Who;
  content: string;
}[];

export type audioGenerateType = {
  who: Who;
  content: string;
  audioUrl: string;
}[];

export type imageGenerateType = {
  who: Who;
  content: string;
  imageUrl: string;
}[];
