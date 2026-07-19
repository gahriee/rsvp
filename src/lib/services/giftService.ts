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
  productLink?: string;
  status: "available" | "reserved";
  reservedBy: mongoose.Types.ObjectId[] | string[];
  maxReservations: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export function formatGiftDoc(doc: RawGiftDoc): Gift {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    imageUrl: doc.imageUrl,
    productLink: doc.productLink,
    status: doc.status,
    reservedBy: Array.isArray(doc.reservedBy) ? doc.reservedBy.map((id: mongoose.Types.ObjectId | string) => id.toString()) : [],
    maxReservations: doc.maxReservations || 3,
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
    productLink: data.productLink,
    status: data.status || "available",
    reservedBy: data.reservedBy ? data.reservedBy.map((id: string) => new mongoose.Types.ObjectId(id)) : [],
    maxReservations: data.maxReservations ?? 3,
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
  if (data.productLink !== undefined) updatePayload.productLink = data.productLink;
  if (data.status !== undefined) updatePayload.status = data.status;
  if (data.maxReservations !== undefined) updatePayload.maxReservations = data.maxReservations;
  if (data.reservedBy !== undefined) {
    updatePayload.reservedBy = data.reservedBy
      ? data.reservedBy.map((id: string) => new mongoose.Types.ObjectId(id))
      : [];
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

  if (gift.reservedBy && gift.reservedBy.length > 0) {
    await RsvpModel.updateMany(
      { _id: { $in: gift.reservedBy } },
      { $set: { selectedGift: null } }
    );
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
  const giftObjectId = new mongoose.Types.ObjectId(giftId);
  const rsvpObjectId = new mongoose.Types.ObjectId(rsvpId);

  const updatedGift = await GiftModel.findOneAndUpdate(
    { 
      _id: giftObjectId, 
      $expr: { $lt: [{ $size: { $ifNull: ["$reservedBy", []] } }, "$maxReservations"] },
      reservedBy: { $ne: rsvpObjectId }
    },
    {
      $push: { reservedBy: rsvpObjectId } as unknown as mongoose.UpdateQuery<RawGiftDoc>,
    },
    { returnDocument: "after" }
  ).lean<RawGiftDoc | null>();

  if (!updatedGift) {
    throw new GiftUnavailableError();
  }

  // Automatically update status if it reached max capacity
  if (updatedGift.reservedBy.length >= updatedGift.maxReservations && updatedGift.status === "available") {
    await GiftModel.updateOne({ _id: giftObjectId }, { $set: { status: "reserved" } });
    updatedGift.status = "reserved";
  }

  return formatGiftDoc(updatedGift);
}
