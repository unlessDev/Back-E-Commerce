import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs"

import prismadb from "@/lib/prismadb";

export async function POST (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse("Acceso Denegado", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Se requiere un nombre", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Se requiere una Imagen URL", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Se requiere una publicación", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("No Autorizado.", { status: 403 });
        }

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        });

    return NextResponse.json(category);
    } catch (err) {
        console.log('[CATEGORIES_POST]', err);
        return new NextResponse("Error Interno", { status: 500 });
    }
};


export async function GET (
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) {
            return new NextResponse("Se requiere una ID de Tienda", { status: 400 });
        }

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId,
            }
        });

    return NextResponse.json(categories);
    } catch (err) {
        console.log('[CATEGORIES_GET]', err);
        return new NextResponse("Error Interno", { status: 500 });
    }
};