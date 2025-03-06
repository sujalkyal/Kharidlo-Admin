// route to add image to product

import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(req) {
    try {
        const { productId, image } = await req.json();
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return new Response("Product not found", { status: 404 });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                image: {
                    push: image
                }
            }
        });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}