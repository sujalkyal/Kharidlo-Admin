import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(req) {
    try {
        const { productId, imageUrl } = await req.json();
        
        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                image: { push: imageUrl },
            },
        });

        return NextResponse.json({ product });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
