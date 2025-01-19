import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = auth();

    if (!(await user).userId) {
      return NextResponse.json("You are not authorized to make a request.", {
        status: 500,
      });
    }

    const data = await prisma.imageGenerator.findMany({
      where: {
        userId: (await user).userId as string,
      },
      select: {
        who: true,
        content: true,
        imageUrl: true,
      },
    });

    if (!data)
      return NextResponse.json("Get content generator data failed.", {
        status: 500,
      });

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) console.log(error.message);

    return NextResponse.json("Request failed.", { status: 500 });
  }
}
