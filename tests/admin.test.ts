import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { Gift as GiftModel } from "@/models/Gift";
import { Rsvp as RsvpModel } from "@/models/Rsvp";
import { getAdminOverviewStats } from "@/lib/services/adminService";
import { GET as getRsvpsRoute } from "@/app/api/v1/rsvp/route";
import { POST as createGiftRoute } from "@/app/api/v1/gifts/route";

let mongoServer: MongoMemoryServer;

describe("Admin Authentication & Statistics Tests", () => {
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

  it("returns 401 Unauthorized when calling GET /api/v1/rsvp without an admin session", async () => {
    const response = await getRsvpsRoute();
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 401 Unauthorized when calling POST /api/v1/gifts without an admin session", async () => {
    const request = new NextRequest("http://localhost/api/v1/gifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Gift",
        description: "Test Description",
        imageUrl: "https://example.com/gift.jpg",
      }),
    });
    const response = await createGiftRoute(request);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Unauthorized");
  });

  it("accurately calculates totalGuestsAttending, attendingRsvps, and reservedGifts counts via getAdminOverviewStats()", async () => {
    // Create seed RSVPs
    await RsvpModel.create([
      {
        guestName: "Alice Smith",
        email: "alice@example.com",
        attending: true,
        numberOfGuests: 2,
        message: "Excited!",
      },
      {
        guestName: "Bob Jones",
        email: "bob@example.com",
        attending: true,
        numberOfGuests: 3,
        message: "Can't wait!",
      },
      {
        guestName: "Charlie Brown",
        email: "charlie@example.com",
        attending: false,
        numberOfGuests: 1,
        message: "Sorry, out of town.",
      },
    ]);

    // Create seed gifts
    await GiftModel.create([
      {
        name: "Gift 1",
        description: "Desc 1",
        imageUrl: "https://example.com/1.jpg",
        status: "available",
      },
      {
        name: "Gift 2",
        description: "Desc 2",
        imageUrl: "https://example.com/2.jpg",
        status: "reserved",
        reservedBy: new mongoose.Types.ObjectId(),
      },
      {
        name: "Gift 3",
        description: "Desc 3",
        imageUrl: "https://example.com/3.jpg",
        status: "reserved",
        reservedBy: new mongoose.Types.ObjectId(),
      },
    ]);

    const stats = await getAdminOverviewStats();

    expect(stats.totalRsvps).toBe(3);
    expect(stats.attendingRsvps).toBe(2);
    expect(stats.decliningRsvps).toBe(1);
    expect(stats.totalGuestsAttending).toBe(5); // 2 + 3
    expect(stats.totalGifts).toBe(3);
    expect(stats.availableGifts).toBe(1);
    expect(stats.reservedGifts).toBe(2);
  });
});
