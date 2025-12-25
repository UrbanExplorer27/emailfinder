import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId, sessionId } = await auth();
  if (!userId || !sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: {},
    create: {
      clerkUserId: userId,
      email: `unknown-${userId}@placeholder.local`,
      plan: "free",
      credits: 100,
    },
  });

  return NextResponse.json({
    id: user.id,
    clerkUserId: user.clerkUserId,
    plan: user.plan,
    credits: user.credits,
    email: user.email,
  });
}

