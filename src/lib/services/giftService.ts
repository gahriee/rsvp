import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Gift as GiftModel } from "@/models/Gift";
import { Rsvp as RsvpModel } from "@/models/Rsvp";
import {
  Gift,
  CreateGiftInput,
  UpdateGiftInput,
  GiftUnavailableError,
} from "@/lib/types";

interface RawGiftDoc {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  description: string;
  imageUrl: string;
  status: "available" | "reserved";
  reservedBy: mongoose.Types.ObjectId | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export function formatGiftDoc(doc: RawGiftDoc): Gift {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    imageUrl: doc.imageUrl,
    status: doc.status,
    reservedBy: doc.reservedBy ? doc.reservedBy.toString() : null,
    createdAt: doc.createdAt instanceof Date
      ? doc.createdAt.toISOString()
      : doc.createdAt?.toString(),
    updatedAt: doc.updatedAt instanceof Date
      ? doc.updatedAt.toISOString()
      : doc.updatedAt?.toString(),
  };
}

export async function getAllGifts(): Promise<Gift[]> {
  await connectToDatabase();
  const gifts = await GiftModel.find({}).sort({ createdAt: -1 }).lean<RawGiftDoc[]>();
  return gifts.map(formatGiftDoc);
}

export async function getGiftById(id: string): Promise<Gift | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  await connectToDatabase();
  const gift = await GiftModel.findById(id).lean<RawGiftDoc | null>();
  if (!gift) {
    return null;
  }
  return formatGiftDoc(gift);
}

export async function createGift(data: CreateGiftInput): Promise<Gift> {
  await connectToDatabase();
  const newGift = await GiftModel.create({
    name: data.name,
    description: data.description,
    imageUrl: data.imageUrl,
    status: data.status || "available",
    reservedBy: data.reservedBy ? new mongoose.Types.ObjectId(data.reservedBy) : null,
  });
  return formatGiftDoc(newGift.toObject() as RawGiftDoc);
}

export async function updateGift(
  id: string,
  data: UpdateGiftInput
): Promise<Gift | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  await connectToDatabase();
  const updatePayload: Record<string, unknown> = {};
  if (data.name !== undefined) updatePayload.name = data.name;
  if (data.description !== undefined) updatePayload.description = data.description;
  if (data.imageUrl !== undefined) updatePayload.imageUrl = data.imageUrl;
  if (data.status !== undefined) updatePayload.status = data.status;
  if (data.reservedBy !== undefined) {
    updatePayload.reservedBy = data.reservedBy
      ? new mongoose.Types.ObjectId(data.reservedBy)
      : null;
  }

  const updated = await GiftModel.findByIdAndUpdate(
    id,
    { $set: updatePayload },
    { returnDocument: "after" }
  ).lean<RawGiftDoc | null>();

  if (!updated) {
    return null;
  }
  return formatGiftDoc(updated);
}

export async function deleteGift(id: string): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  await connectToDatabase();
  const gift = await GiftModel.findById(id);
  if (!gift) {
    return false;
  }

  if (gift.reservedBy) {
    await RsvpModel.findByIdAndUpdate(gift.reservedBy, {
      $set: { selectedGift: null },
    });
  }

  await GiftModel.findByIdAndDelete(id);
  return true;
}

export async function reserveGiftAtomically(
  giftId: string,
  rsvpId: string
): Promise<Gift> {
  if (!mongoose.Types.ObjectId.isValid(giftId) || !mongoose.Types.ObjectId.isValid(rsvpId)) {
    throw new GiftUnavailableError("Invalid gift ID or RSVP ID");
  }
  await connectToDatabase();
  const updatedGift = await GiftModel.findOneAndUpdate(
    { _id: giftId, status: "available" },
    {
      $set: {
        status: "reserved",
        reservedBy: new mongoose.Types.ObjectId(rsvpId),
      },
    },
    { returnDocument: "after" }
  ).lean<RawGiftDoc | null>();

  if (!updatedGift) {
    throw new GiftUnavailableError();
  }

  return formatGiftDoc(updatedGift);
}
