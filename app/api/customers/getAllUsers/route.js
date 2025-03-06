// get all users

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET() {
    try{
        const users = await prisma.user.findMany();
        return NextResponse.json({users});
    }
    catch(error){
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}