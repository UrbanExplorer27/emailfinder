import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { fullName, domain, resultEmail, confidence } = body ?? {};

  if (!fullName || !domain) {
    return NextResponse.json({ error: "fullName and domain are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (resultEmail && user.credits <= 0) {
    return NextResponse.json({ error: "No credits remaining" }, { status: 402 });
  }

  const status = resultEmail ? "FOUND" : "FAILED";

  const lookup = await prisma.lookup.create({
    data: {
      userId: user.id,
      fullName,
      domain,
      resultEmail: resultEmail ?? null,
      confidence: confidence ?? null,
      status,
    },
  });

  if (resultEmail) {
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } },
    });
  }

  return NextResponse.json({ lookupId: lookup.id, status: lookup.status });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const lookups = await prisma.lookup.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  return NextResponse.json({
    lookups: lookups.map((l) => ({
      id: l.id,
      fullName: l.fullName,
      domain: l.domain,
      email: l.resultEmail,
      status: l.status,
      confidence: l.confidence,
      createdAt: l.createdAt,
    })),
  });
}

