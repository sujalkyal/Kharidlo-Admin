import { NextResponse } from "next/server";
import prisma from "../../../../db/src/index";

//recieve the user id and then fetch the user details
export async function GET(req) {
  const { userId } = req.query;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.error({
      status: 500,
      message: "Failed to fetch user details",
    });
  }
}