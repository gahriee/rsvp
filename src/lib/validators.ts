import { z } from "zod";

export const createRsvpSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  email: z.string().email("Invalid email address"),
  attending: z.boolean(),
  numberOfGuests: z.number().int().min(1, "Number of guests must be at least 1"),
  message: z.string().optional().default(""),
  selectedGift: z.string().nullable().optional().default(null),
});

export const updateRsvpSchema = createRsvpSchema.partial();

export const createGiftSchema = z.object({
  name: z.string().min(1, "Gift name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Invalid image URL"),
  status: z.enum(["available", "reserved"]).optional().default("available"),
  reservedBy: z.string().nullable().optional().default(null),
});

export const updateGiftSchema = createGiftSchema.partial();

export const reserveGiftSchema = z.object({
  rsvpId: z.string().min(1, "RSVP ID is required"),
});
