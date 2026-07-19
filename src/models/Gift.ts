import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IGiftDocument extends Document {
  name: string;
  description: string;
  imageUrl: string;
  productLink?: string;
  status: "available" | "reserved";
  reservedBy: Types.ObjectId[];
  maxReservations: number;
  createdAt: Date;
  updatedAt: Date;
}

const giftSchema = new Schema<IGiftDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    productLink: { type: String, required: false },
    status: {
      type: String,
      enum: ["available", "reserved"],
      default: "available",
    },
    reservedBy: [{ type: Schema.Types.ObjectId, ref: "Rsvp" }],
    maxReservations: { type: Number, default: 3 },
  },
  {
    timestamps: true,
  }
);

// Delete cached model in development to ensure schema updates are applied during HMR
if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Gift;
}

export const Gift: Model<IGiftDocument> =
  mongoose.models.Gift || mongoose.model<IGiftDocument>("Gift", giftSchema);
export default Gift;
