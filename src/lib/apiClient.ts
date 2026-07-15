import { Gift, Rsvp, CreateRsvpInput, ApiResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export async function fetchGifts(): Promise<Gift[]> {
  const response = await fetch(`${BASE_URL}/gifts`, {
    cache: "no-store",
  });
  const result: ApiResponse<Gift[]> = await response.json();
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch gifts");
  }
  return result.data;
}

export async function fetchGiftById(id: string): Promise<Gift> {
  const response = await fetch(`${BASE_URL}/gifts/${id}`, {
    cache: "no-store",
  });
  const result: ApiResponse<Gift> = await response.json();
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch gift");
  }
  return result.data;
}

export async function submitRsvp(payload: CreateRsvpInput): Promise<Rsvp> {
  const response = await fetch(`${BASE_URL}/rsvp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result: ApiResponse<Rsvp> = await response.json();
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || "Failed to submit RSVP");
  }
  return result.data;
}

export async function reserveGift(
  giftId: string,
  rsvpId: string
): Promise<Gift> {
  const response = await fetch(`${BASE_URL}/gifts/${giftId}/reserve`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rsvpId }),
  });
  const result: ApiResponse<Gift> = await response.json();
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || "Failed to reserve gift");
  }
  return result.data;
}

export async function fetchRsvpById(id: string): Promise<Rsvp> {
  const response = await fetch(`${BASE_URL}/rsvp/${id}`, {
    cache: "no-store",
  });
  const result: ApiResponse<Rsvp> = await response.json();
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || "Failed to fetch RSVP details");
  }
  return result.data;
}
