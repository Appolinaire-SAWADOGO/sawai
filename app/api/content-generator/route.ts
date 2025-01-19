import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const user = auth();
    const body = await req.json();
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    if (!(await user).userId) {
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
        id: (await user).userId as string,
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
      const openai = new OpenAI();

      const completion = await openai.chat.completions.create({
        model: "o1-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: body.prompt as string,
          },
        ],
      });

      if (!completion)
        return NextResponse.json("Api request failed.", {
          status: 500,
        });

      const PostData = await prisma.contentGenerator.createMany({
        data: [
          {
            userId: (await user).userId as string,
            who: "YOU",
            content: body.prompt,
          },
          {
            userId: (await user).userId as string,
            who: "Ai",
            content: completion.choices[0].message.content as string,
          },
        ],
      });

      if (!PostData)
        return NextResponse.json("Data base post failed.", { status: 500 });

      if (
        !userRequestStatus.requestGestion ||
        userRequestStatus.toDayRequest === 0
      ) {
        const createRequestGestion = await prisma.requestGestion.create({
          data: {
            userId: (await user).userId as string,
            EndRequestTime: tomorrow,
          },
        });

        if (!createRequestGestion)
          return NextResponse.json("create request gestion failed.", {
            status: 500,
          });
      }

      const incrementTodayRequestNumber = await prisma.user.update({
        where: {
          id: (await user).userId as string,
        },
        data: {
          toDayRequest: {
            increment: 1,
          },
        },
      });

      if (!incrementTodayRequestNumber)
        return NextResponse.json("Increment today request number failed.", {
          status: 500,
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
