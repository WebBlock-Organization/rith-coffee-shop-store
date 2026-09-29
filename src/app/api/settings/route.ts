import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
    if (!tenantId) {
      return NextResponse.json({ error: "NEXT_PUBLIC_TENANT_ID is not set in .env" }, { status: 400 });
    }

    const setting = await prisma.siteSetting.findUnique({
      where: {
        tenantId: tenantId,
      },
    });

    return NextResponse.json(setting || {});
  } catch (error: any) {
    console.error("Prisma error querying site settings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
