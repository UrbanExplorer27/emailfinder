import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { name, email, domain } = body ?? {};
  if (!email || !domain) {
    return NextResponse.json({ error: "email and domain are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const list = await prisma.leadList.findFirst({
    where: { id: params.id, userId: user.id },
  });
  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }

  const item = await prisma.leadListItem.create({
    data: {
      leadListId: list.id,
      name: name ?? null,
      email,
      domain,
    },
  });

  return NextResponse.json({ item });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  if (!itemId) {
    return NextResponse.json({ error: "itemId query param is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const item = await prisma.leadListItem.findFirst({
    where: { id: itemId, leadList: { userId: user.id, id: params.id } },
    include: { leadList: true },
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  await prisma.leadListItem.delete({ where: { id: item.id } });

  return NextResponse.json({ ok: true });
}

