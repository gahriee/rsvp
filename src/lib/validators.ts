import { z } from "zod";

export const createRsvpSchema = z.object({
  guestName: z.string().min(1, "Guest name is required"),
  email: z.string().email("Invalid email address"),
  attending: z.boolean(),
  message: z.string().optional().default(""),
  selectedGift: z.string().nullable().optional().default(null),
});

export const updateRsvpSchema = createRsvpSchema.partial();

export const createGiftSchema = z.object({
  name: z.string().min(1, "Gift name is required"),
  description: z.string().optional().or(z.literal("")),
  imageUrl: z.string().min(1, "Image is required"),
  productLink: z.string().url().optional().or(z.literal("")),
  status: z.enum(["available", "reserved"]).optional().default("available"),
  reservedBy: z.array(z.string()).optional().default([]),
  maxReservations: z.number().int().min(1).optional().default(3),
});

export const updateGiftSchema = createGiftSchema.partial();

export const reserveGiftSchema = z.object({
  rsvpId: z.string().min(1, "RSVP ID is required"),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

