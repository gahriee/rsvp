import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IGiftDocument extends Document {
  name: string;
  description: string;
  imageUrl: string;
  status: "available" | "reserved";
  reservedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const giftSchema = new Schema<IGiftDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "reserved"],
      default: "available",
    },
    reservedBy: { type: Schema.Types.ObjectId, ref: "Rsvp", default: null },
  },
  {
    timestamps: true,
  }
);

export const Gift: Model<IGiftDocument> =
  mongoose.models.Gift || mongoose.model<IGiftDocument>("Gift", giftSchema);
export default Gift;
