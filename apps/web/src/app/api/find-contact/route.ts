import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type FindContactResponse =
  | {
      email: string | null;
      status: string;
      score?: number | null;
      result?: string | null;
      raw?: unknown;
    }
  | { error: string };

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { fullName, domain } = body ?? {};
  if (!fullName || !domain) {
    return NextResponse.json({ error: "fullName and domain are required" }, { status: 400 });
  }

  const apiKey = process.env.EMAIL_LIST_VERIFY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing EMAIL_LIST_VERIFY_API_KEY" }, { status: 500 });
  }

  try {
    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    const lastName = rest.join(" ").trim();

    const upstreamBody = {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      domain,
    };

    const res = await fetch("https://api.emaillistverify.com/api/findContact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify(upstreamBody),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Upstream error ${res.status}: ${text}` }, { status: 502 });
    }

    const data = (await res.json()) as any;
    const firstCandidate = Array.isArray(data) ? data[0] : null;
    const email = firstCandidate?.email ?? null;
    const confidenceValue = firstCandidate?.confidence ?? null;
    const resultCode = firstCandidate?.result ?? null;
    const status = resultCode ?? (email ? "found" : "not_found");

    const result: FindContactResponse = {
      email,
      status,
      score: confidenceValue,
      result: resultCode,
      raw: data,
    };

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Request failed: ${message}` }, { status: 500 });
  }
}

