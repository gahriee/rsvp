import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Rsvp as RsvpModel } from "@/models/Rsvp";
import { Gift as GiftModel } from "@/models/Gift";
import { reserveGiftAtomically } from "./giftService";
import {
  Rsvp,
  CreateRsvpInput,
  UpdateRsvpInput,
} from "@/lib/types";

interface RawRsvpDoc {
  _id: mongoose.Types.ObjectId | string;
  guestName: string;
  email: string;
  attending: boolean;
  message: string;
  selectedGift: mongoose.Types.ObjectId | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export function formatRsvpDoc(doc: RawRsvpDoc): Rsvp {
  return {
    _id: doc._id.toString(),
    guestName: doc.guestName,
    email: doc.email,
    attending: doc.attending,
    message: doc.message || "",
    selectedGift: doc.selectedGift ? doc.selectedGift.toString() : null,
    createdAt: doc.createdAt instanceof Date
      ? doc.createdAt.toISOString()
      : doc.createdAt?.toString(),
    updatedAt: doc.updatedAt instanceof Date
      ? doc.updatedAt.toISOString()
      : doc.updatedAt?.toString(),
  };
}

export async function getAllRsvps(): Promise<Rsvp[]> {
  await connectToDatabase();
  const rsvps = await RsvpModel.find({}).sort({ createdAt: -1 }).lean<RawRsvpDoc[]>();
  return rsvps.map(formatRsvpDoc);
}

export async function getRsvpById(id: string): Promise<Rsvp | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  await connectToDatabase();
  const rsvp = await RsvpModel.findById(id).lean<RawRsvpDoc | null>();
  if (!rsvp) {
    return null;
  }
  return formatRsvpDoc(rsvp);
}

export async function createRsvp(data: CreateRsvpInput): Promise<Rsvp> {
  await connectToDatabase();

  const existingRsvp = await RsvpModel.findOne({ email: data.email });
  if (existingRsvp) {
    throw new Error("An RSVP with this email has already been submitted.");
  }

  if (data.selectedGift) {
    const rsvpId = new mongoose.Types.ObjectId();
    await reserveGiftAtomically(data.selectedGift, rsvpId.toString());

    try {
      const newRsvp = await RsvpModel.create({
        _id: rsvpId,
        guestName: data.guestName,
        email: data.email,
        attending: data.attending,
        message: data.message || "",
        selectedGift: new mongoose.Types.ObjectId(data.selectedGift),
      });
      return formatRsvpDoc(newRsvp.toObject() as RawRsvpDoc);
    } catch (error) {
      await GiftModel.findByIdAndUpdate(data.selectedGift, {
        $pull: { reservedBy: rsvpId },
        $set: { status: "available" }
      });
      throw error;
    }
  } else {
    const newRsvp = await RsvpModel.create({
      guestName: data.guestName,
      email: data.email,
      attending: data.attending,
      message: data.message || "",
      selectedGift: null,
    });
    return formatRsvpDoc(newRsvp.toObject() as RawRsvpDoc);
  }
}

export async function updateRsvp(
  id: string,
  data: UpdateRsvpInput
): Promise<Rsvp | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  await connectToDatabase();
  const current = await RsvpModel.findById(id);
  if (!current) {
    return null;
  }

  const currentGiftId = current.selectedGift ? current.selectedGift.toString() : null;
  const newGiftId = data.selectedGift !== undefined ? data.selectedGift : currentGiftId;

  if (data.selectedGift !== undefined && newGiftId !== currentGiftId) {
    if (currentGiftId) {
      await GiftModel.findByIdAndUpdate(currentGiftId, {
        $pull: { reservedBy: new mongoose.Types.ObjectId(id) },
        $set: { status: "available" }
      });
    }
    if (newGiftId) {
      await reserveGiftAtomically(newGiftId, id);
    }
  }

  const updatePayload: Record<string, unknown> = {};
  if (data.guestName !== undefined) updatePayload.guestName = data.guestName;
  if (data.email !== undefined) updatePayload.email = data.email;
  if (data.attending !== undefined) updatePayload.attending = data.attending;
  if (data.message !== undefined) updatePayload.message = data.message;
  if (data.selectedGift !== undefined) {
    updatePayload.selectedGift = data.selectedGift
      ? new mongoose.Types.ObjectId(data.selectedGift)
      : null;
  }

  const updated = await RsvpModel.findByIdAndUpdate(
    id,
    { $set: updatePayload },
    { returnDocument: "after" }
  ).lean<RawRsvpDoc | null>();

  if (!updated) {
    return null;
  }
  return formatRsvpDoc(updated);
}

export async function deleteRsvp(id: string): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  await connectToDatabase();
  const current = await RsvpModel.findById(id);
  if (!current) {
    return false;
  }

  if (current.selectedGift) {
    await GiftModel.findByIdAndUpdate(current.selectedGift, {
      $pull: { reservedBy: new mongoose.Types.ObjectId(id) },
      $set: { status: "available" }
    });
  }

  await RsvpModel.findByIdAndDelete(id);
  return true;
}
