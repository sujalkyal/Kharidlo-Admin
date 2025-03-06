// route to get all products

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function GET(req) {
    try{
        const products = await prisma.product.findMany({});
        return NextResponse.json({products});
    }
    catch(error){
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}