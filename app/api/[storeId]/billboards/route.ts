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

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Acceso Denegado.", { status: 401 });
        }

        if (!label) {
            return new NextResponse("Se requiere una Descripción", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Se requiere una Imagen URL", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Se requiere una ID de Tienda", { status: 400 });
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

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

    return NextResponse.json(billboard);
    } catch (err) {
        console.log('[BILLBOARDS_POST]', err);
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

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId,
            }
        });

    return NextResponse.json(billboards);
    } catch (err) {
        console.log('[BILLBOARDS_POST]', err);
        return new NextResponse("Error Interno", { status: 500 });
    }
};