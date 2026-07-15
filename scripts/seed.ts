import mongoose from "mongoose";
import { Gift } from "../src/models/Gift";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/graduation-rsvp";

const initialGifts = [
  {
    name: "Espresso Machine",
    description: "Compact stainless steel espresso maker for morning fuel.",
    imageUrl:
      "https://images.unsplash.com/photo-1517668808822-914e1564322b?w=600",
    status: "available",
  },
  {
    name: "Noise-Canceling Headphones",
    description: "Premium wireless over-ear headphones for work and travel.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    status: "available",
  },
  {
    name: "Professional Backpack",
    description: "Water-resistant commuter backpack with laptop compartment.",
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    status: "available",
  },
  {
    name: "Cast Iron Skillet Set",
    description: "Pre-seasoned heavy duty cast iron cookware set.",
    imageUrl:
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600",
    status: "available",
  },
  {
    name: "Smart Cooker & Air Fryer",
    description:
      "Multi-functional kitchen appliance for quick weeknight meals.",
    imageUrl:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600",
    status: "available",
  },
  {
    name: "Standing Desk Mat",
    description: "Ergonomic anti-fatigue mat for long study or work sessions.",
    imageUrl:
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600",
    status: "available",
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected. Seeding initial gift list...");

  await Gift.deleteMany({});
  await Gift.insertMany(initialGifts);

  console.log(
    `Successfully seeded ${initialGifts.length} gifts into database!`
  );
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Error running seed script:", error);
  process.exit(1);
});
