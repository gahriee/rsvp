import { z } from "zod";
import {
  createRsvpSchema,
  updateRsvpSchema,
  createGiftSchema,
  updateGiftSchema,
  reserveGiftSchema,
} from "./validators";

export type CreateRsvpInput = z.infer<typeof createRsvpSchema>;
export type UpdateRsvpInput = z.infer<typeof updateRsvpSchema>;
export type CreateGiftInput = z.infer<typeof createGiftSchema>;
export type UpdateGiftInput = z.infer<typeof updateGiftSchema>;
export type ReserveGiftInput = z.infer<typeof reserveGiftSchema>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export type GiftStatus = "available" | "reserved";

export interface Gift {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: GiftStatus;
  reservedBy: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Rsvp {
  _id: string;
  guestName: string;
  email: string;
  attending: boolean;
  numberOfGuests: number;
  message: string;
  selectedGift: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export class GiftUnavailableError extends Error {
  constructor(message = "Gift is already reserved or unavailable") {
    super(message);
    this.name = "GiftUnavailableError";
  }
}
