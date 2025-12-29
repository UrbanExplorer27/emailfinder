import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { PlanId } from "@/config/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IncomingRow = {
  firstName?: string;
  lastName?: string;
  domain?: string;
};

type ResultRow = {
  firstName: string;
  lastName: string;
  domain: string;
  email: string | null;
  status: "found" | "not_found" | "error";
  score?: number | null;
  result?: string | null;
  error?: string;
};

const ALLOWED_PLANS: PlanId[] = ["starter", "pro"];
const MAX_ROWS = 50;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.EMAIL_LIST_VERIFY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing EMAIL_LIST_VERIFY_API_KEY" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const rows = Array.isArray(body?.rows) ? (body.rows as IncomingRow[]) : [];

  if (!rows.length) {
    return NextResponse.json({ error: "rows is required" }, { status: 400 });
  }

  const trimmed = rows
    .slice(0, MAX_ROWS)
    .map((r) => ({
      firstName: (r.firstName ?? "").trim(),
      lastName: (r.lastName ?? "").trim(),
      domain: (r.domain ?? "").trim(),
    }))
    .filter((r) => r.domain);

  if (!trimmed.length) {
    return NextResponse.json({ error: "No valid rows (firstName,lastName,domain) provided" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const planId = (user.plan as PlanId) ?? "trial";
  if (!ALLOWED_PLANS.includes(planId)) {
    return NextResponse.json({ error: "Mass lookup is available on Starter and Pro" }, { status: 403 });
  }

  let remainingCredits = user.credits ?? 0;
  const results: ResultRow[] = [];
  let foundCount = 0;

  for (const row of trimmed) {
    if (remainingCredits <= 0) {
      results.push({
        ...row,
        email: null,
        status: "error",
        error: "Insufficient credits",
      });
      continue;
    }

    try {
      const upstreamBody = {
        firstName: row.firstName || undefined,
        lastName: row.lastName || undefined,
        domain: row.domain,
      };

      const res = await fetch("https://api.emaillistverify.com/api/findContact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify(upstreamBody),
      });

      if (!res.ok) {
        const text = await res.text();
        results.push({
          ...row,
          email: null,
          status: "error",
          error: `Upstream ${res.status}: ${text.slice(0, 200)}`,
        });
        continue;
      }

      const data = (await res.json()) as any;
      const firstCandidate = Array.isArray(data) ? data[0] : null;
      const email = firstCandidate?.email ?? null;
      const confidenceValue = firstCandidate?.confidence ?? null;
      const resultCode = firstCandidate?.result ?? null;
      const status = resultCode === "ok" ? "found" : "not_found";

      if (status === "found") {
        foundCount += 1;
        remainingCredits -= 1;
      }

      results.push({
        ...row,
        email,
        status,
        score: confidenceValue,
        result: resultCode,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      results.push({
        ...row,
        email: null,
        status: "error",
        error: message,
      });
    }
  }

  if (foundCount > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: Math.max(0, user.credits - foundCount) },
    });
  }

  return NextResponse.json({
    processed: results.length,
    debited: foundCount,
    remainingCredits: Math.max(0, remainingCredits),
    results,
  });
}


