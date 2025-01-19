import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const today = new Date();

export async function GET() {
  try {
    const user = auth();
    const userId = (await user).userId as string;
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    if (!userId) {
      return NextResponse.json("You are not authorized to make a request.", {
        status: 500,
      });
    }

    const userRequestGestion = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        toDayRequest: true,
        requestGestion: true,
      },
    });

    if (
      !userRequestGestion?.requestGestion ||
      today.getTime() <
        userRequestGestion?.requestGestion?.EndRequestTime?.getTime()
    ) {
      return NextResponse.json({ number: userRequestGestion?.toDayRequest });
    } else {
      if (
        today.getTime() >
        userRequestGestion?.requestGestion?.EndRequestTime?.getTime()
      ) {
        await prisma.requestGestion.update({
          where: {
            userId: userId,
          },
          data: {
            EndRequestTime: tomorrow,
          },
        });
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          toDayRequest: 0,
        },
      });
      return NextResponse.json({ number: 0 });
    }
  } catch (error) {
    if (error instanceof Error) console.log(error.message);

    return NextResponse.json("Request failed.", { status: 500 });
  }
}
