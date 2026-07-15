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
    guestAggregation,
    totalGifts,
    availableGifts,
    reservedGifts,
  ] = await Promise.all([
    RsvpModel.countDocuments({}),
    RsvpModel.countDocuments({ attending: true }),
    RsvpModel.countDocuments({ attending: false }),
    RsvpModel.aggregate([
      { $match: { attending: true } },
      { $group: { _id: null, totalGuests: { $sum: "$numberOfGuests" } } },
    ]),
    GiftModel.countDocuments({}),
    GiftModel.countDocuments({ status: "available" }),
    GiftModel.countDocuments({ status: "reserved" }),
  ]);

  const totalGuestsAttending =
    guestAggregation.length > 0 ? guestAggregation[0].totalGuests || 0 : 0;

  return {
    totalRsvps,
    attendingRsvps,
    decliningRsvps,
    totalGuestsAttending,
    totalGifts,
    availableGifts,
    reservedGifts,
  };
}
