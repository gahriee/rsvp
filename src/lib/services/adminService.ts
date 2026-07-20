import { connectToDatabase } from "@/lib/mongodb";
import { Rsvp as RsvpModel } from "@/models/Rsvp";
import { Gift as GiftModel } from "@/models/Gift";
import { AdminOverviewStats } from "@/lib/types";

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  await connectToDatabase();

  const [
    totalRsvps,
    attendingRsvps,
    decliningRsvps,
    totalGifts,
    availableGifts,
    reservedGifts,
  ] = await Promise.all([
    RsvpModel.countDocuments({}),
    RsvpModel.countDocuments({ attending: true }),
    RsvpModel.countDocuments({ attending: false }),
    GiftModel.countDocuments({}),
    GiftModel.countDocuments({ status: "available" }),
    GiftModel.countDocuments({ status: "reserved" }),
  ]);

  return {
    totalRsvps,
    attendingRsvps,
    decliningRsvps,
    totalGifts,
    availableGifts,
    reservedGifts,
  };
}
