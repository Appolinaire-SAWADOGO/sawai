import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = auth();
    const body = await req.json();

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

    const data = await prisma.user.create({
      data: {
        id: (await user).userId as string,
        name: body.name as string,
        email: body.email as string,
      },
    });

    if (data) {
      return NextResponse.json("Request succes.", { status: 200 });
    } else {
      return NextResponse.json("Request failed.", { status: 500 });
    }
  } catch (error) {
    if (error instanceof Error) console.log(error.message);

    return NextResponse.json("Request failed.", { status: 500 });
  }
}
