import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../../lib/mongodb";
import { reserveGiftAtomically } from "../../../../../../lib/services/giftService";
import { reserveGiftSchema } from "../../../../../../lib/validators";
import { GiftUnavailableError } from "../../../../../../lib/types";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const validatedData = reserveGiftSchema.parse(body);

    const reservedGift = await reserveGiftAtomically(id, validatedData.rsvpId);
    return NextResponse.json({ success: true, data: reservedGift });
  } catch (error) {
    if (error instanceof GiftUnavailableError) {
      return NextResponse.json(
        { success: false, error: "Gift is already reserved" },
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
