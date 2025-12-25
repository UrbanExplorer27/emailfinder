import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { plans } from "@/config/plans";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const plan = plans[user.plan as keyof typeof plans];

  return NextResponse.json({
    credits: user.credits,
    plan: user.plan,
    planName: plan?.name ?? user.plan,
    planCredits: plan?.credits ?? null,
    planPriceMonthlyUsd: plan?.priceMonthlyUsd ?? null,
  });
}

