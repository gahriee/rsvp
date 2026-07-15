import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../lib/mongodb";
import {
  getRsvpById,
  updateRsvp,
  deleteRsvp,
} from "../../../../../lib/services/rsvpService";
import { updateRsvpSchema } from "../../../../../lib/validators";
import { isAdminAuthenticated } from "../../../../../lib/auth";
import { GiftUnavailableError } from "../../../../../lib/types";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const rsvp = await getRsvpById(id);
    if (!rsvp) {
      return NextResponse.json(
        { success: false, error: "RSVP not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: rsvp });
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

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateRsvpSchema.parse(body);

    const updated = await updateRsvp(id, validatedData);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "RSVP not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const success = await deleteRsvp(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "RSVP not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
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
