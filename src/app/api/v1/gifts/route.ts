import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAllGifts, createGift } from "@/lib/services/giftService";
import { createGiftSchema } from "@/lib/validators";
import { isAdminAuthenticated } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  try {
    await connectToDatabase();
    const gifts = await getAllGifts();
    return NextResponse.json({ success: true, data: gifts });
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
    await connectToDatabase();
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createGiftSchema.parse(body);
    const newGift = await createGift(validatedData);

    return NextResponse.json({ success: true, data: newGift }, { status: 201 });
  } catch (error) {
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
