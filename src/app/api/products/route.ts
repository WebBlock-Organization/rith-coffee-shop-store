import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
    if (!tenantId) {
      return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is not set in .env" }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: {
        tenantId: tenantId,
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Prisma error querying products:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
