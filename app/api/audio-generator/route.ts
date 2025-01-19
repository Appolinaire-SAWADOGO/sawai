import prisma from "@/lib/db";
import { createAudioFileFromText } from "@/lib/elevenlabs";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = auth();
    const userId = (await user).userId as string;
    const body = await req.json();
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    if (!userId) {
      return NextResponse.json("You are not authorized to make a request.", {
        status: 500,
      });
    }

    if (!body) {
      return NextResponse.json("The information is empty.", {
        status: 500,
      });
    }

    const userRequestStatus = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        toDayRequest: true,
        requestGestion: true,
      },
    });

    if (!userRequestStatus) {
      return NextResponse.json("User can not exist.", {
        status: 500,
      });
    }

    if ((userRequestStatus?.toDayRequest as number) < 10) {
      const audioName = await createAudioFileFromText(body.prompt);
      const audioUrl = `/user-audio-generate/${audioName}`;

      await prisma.audioGenerator.createMany({
        data: [
          {
            userId: (await user).userId as string,
            who: "YOU",
            content: body.prompt,
          },
          {
            userId: (await user).userId as string,
            who: "Ai",
            audioUrl: audioUrl,
          },
        ],
      });

      if (!userRequestStatus.requestGestion) {
        await prisma.requestGestion.create({
          data: {
            userId: userId,
            EndRequestTime: tomorrow,
          },
        });
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          toDayRequest: {
            increment: 1,
          },
        },
      });

      return NextResponse.json("Request succes.", { status: 200 });
    } else {
      return NextResponse.json(
        { todayRequestNumberSupTen: true },
        { status: 200 }
      );
    }
  } catch (error) {
    if (error instanceof Error) console.log(error.message);

    return NextResponse.json("Request failed.", { status: 500 });
  }
}
