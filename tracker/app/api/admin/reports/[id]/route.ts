import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  await prisma.report.update({
    where: { id: Number(params.id) },
    data: { status },
  });
  return NextResponse.json({ ok: true });
}