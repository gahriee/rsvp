import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAllRsvps, createRsvp } from "@/lib/services/rsvpService";
import { createRsvpSchema } from "@/lib/validators";
import { isAdminAuthenticated } from "@/lib/auth";
import { GiftUnavailableError } from "@/lib/types";
import { checkRateLimit } from "@/lib/services/rateLimitService";
import { sendRsvpConfirmationEmail } from "@/lib/services/emailService";
import { z } from "zod";

export async function GET() {
  try {
    await connectToDatabase();
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const rsvps = await getAllRsvps();
    return NextResponse.json({ success: true, data: rsvps });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rate = checkRateLimit(ip, 5, 60000);
    if (!rate.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "X-RateLimit-Remaining": String(rate.remaining) },
        }
      );
    }

    await connectToDatabase();
    const body = await request.json();
    const validatedData = createRsvpSchema.parse(body);
    const newRsvp = await createRsvp(validatedData);

    sendRsvpConfirmationEmail(newRsvp).catch((err) =>
      console.error("Email dispatch error:", err)
    );

    return NextResponse.json({ success: true, data: newRsvp }, { status: 201 });
  } catch (error) {
    if (error instanceof GiftUnavailableError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
