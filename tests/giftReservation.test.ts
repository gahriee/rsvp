import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Gift as GiftModel } from "../src/models/Gift";
import { Rsvp as RsvpModel } from "../src/models/Rsvp";
import { reserveGiftAtomically } from "../src/lib/services/giftService";
import { GiftUnavailableError } from "../src/lib/types";

let mongoServer: MongoMemoryServer;

describe("Atomic Gift Reservation Concurrency Test", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    await GiftModel.deleteMany({});
    await RsvpModel.deleteMany({});
  });

  it("simulates concurrent reserveGiftAtomically calls for a gift with maxReservations 1, ensuring exactly 1 succeeds", async () => {
    const giftDocs = await GiftModel.create([{
      name: "Coffee Maker",
      description: "High quality coffee maker",
      imageUrl: "https://example.com/coffee.jpg",
      status: "available",
      reservedBy: [],
      maxReservations: 1,
    }]);
    
    const gift = giftDocs[0];

    const rsvp1Id = new mongoose.Types.ObjectId().toString();
    const rsvp2Id = new mongoose.Types.ObjectId().toString();

    const results = await Promise.allSettled([
      reserveGiftAtomically(gift._id.toString(), rsvp1Id),
      reserveGiftAtomically(gift._id.toString(), rsvp2Id),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);

    if (rejected[0].status === "rejected") {
      expect(rejected[0].reason).toBeInstanceOf(GiftUnavailableError);
    }

    const updatedGift = await GiftModel.findById(gift._id);
    expect(updatedGift?.status).toBe("reserved");
    expect(updatedGift?.reservedBy.length).toBe(1);
  });
});
