import { NextResponse } from "next/server";
import prisma from "@repo/db/client"; // Ensure correct import path

export async function POST(req) {
    try {
        const body = await req.json();

        if (!body || !body.productId) {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        const { productId, name, price, stock } = body;

        // Check if the product exists
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Update product with new values or keep existing ones
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name: name !== undefined ? name : product.name,
                price: price !== undefined ? Number(price) : product.price,
                stock: stock !== undefined ? Number(stock) : product.stock
            }
        });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
