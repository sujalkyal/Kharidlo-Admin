// route to add new product

import { NextResponse } from "next/server";
import prisma from "../../../../db/src/index";

export async function POST(req) {
    try{
        const {name,image,description,price,stock,category} = await req.json();
        const product = await prisma.product.create({
            data:{
                name,
                image: { set: image },
                description,
                price,
                stock,
                category
            }
        });    
        return NextResponse.json({product});
    }
    catch(error){
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}