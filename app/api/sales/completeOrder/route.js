import { NextResponse } from "next/server";
import prisma from "../../../../db/src/index";

export async function PUT(req) {
    try {
        const { orderId, status } = await req.json();

        const updatedOrder = await prisma.orders.update({
            where: { id: orderId },
            data: { status }
        });

        return NextResponse.json({ message: "Order completed", order: updatedOrder });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
