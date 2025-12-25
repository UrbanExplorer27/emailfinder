import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { defaultPlan, plans } from "@/config/plans";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
      plan: defaultPlan,
      credits: plans[defaultPlan].credits,
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

