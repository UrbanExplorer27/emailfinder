import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { PlanId, plans } from "@/config/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SyncBody = {
  sessionId?: string;
};

const priceToPlan: Partial<Record<string, PlanId>> = {};
if (process.env.STRIPE_PRICE_STARTER) {
  priceToPlan[process.env.STRIPE_PRICE_STARTER] = "starter";
}
if (process.env.STRIPE_PRICE_PRO) {
  priceToPlan[process.env.STRIPE_PRICE_PRO] = "pro";
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
  }

  const body = (await req.json().catch(() => ({}))) as SyncBody;
  const sessionId = body.sessionId;
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });

  // Retrieve the checkout session and associated subscription/line item.
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;

  if (!customerId) {
    return NextResponse.json({ error: "No Stripe customer on session" }, { status: 400 });
  }

  let priceId: string | null = null;
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 1 });
    priceId = lineItems.data[0]?.price?.id ?? null;
  } catch {
    // fallback to subscription items below
  }

  // Fallback to subscription items if line items weren't available.
  if (!priceId && session.subscription) {
    const subscription =
      typeof session.subscription === "string"
        ? await stripe.subscriptions.retrieve(session.subscription)
        : (session.subscription as Stripe.Subscription);
    priceId = subscription.items.data[0]?.price?.id ?? null;
  }

  const planId = priceId ? priceToPlan[priceId] ?? null : null;
  if (!planId) {
    return NextResponse.json({ error: "Could not determine plan from price" }, { status: 400 });
  }

  const plan = plans[planId];

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeCustomerId: user.stripeCustomerId ?? customerId,
      plan: planId,
      credits: plan.credits,
    },
  });

  return NextResponse.json({
    plan: updated.plan,
    credits: updated.credits,
  });
}


