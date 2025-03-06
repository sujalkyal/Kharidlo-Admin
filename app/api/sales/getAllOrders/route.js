// route to get all orders

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET(req) {
    try{
        const orders = await prisma.orders.findMany({});
        return NextResponse.json({orders});
    }
    catch(error){
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}