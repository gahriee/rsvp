import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IRsvpDocument extends Document {
  guestName: string;
  email: string;
  attending: boolean;
  numberOfGuests: number;
  message: string;
  selectedGift: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const rsvpSchema = new Schema<IRsvpDocument>(
  {
    guestName: { type: String, required: true },
    email: { type: String, required: true },
    attending: { type: Boolean, required: true },
    numberOfGuests: { type: Number, required: true, min: 1 },
    message: { type: String, default: "" },
    selectedGift: { type: Schema.Types.ObjectId, ref: "Gift", default: null },
  },
  {
    timestamps: true,
  }
);

// Delete cached model in development to ensure schema updates are applied during HMR
if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Rsvp;
}

export const Rsvp: Model<IRsvpDocument> =
  mongoose.models.Rsvp || mongoose.model<IRsvpDocument>("Rsvp", rsvpSchema);
export default Rsvp;
