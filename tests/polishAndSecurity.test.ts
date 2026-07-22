import { describe, it, expect, beforeEach, vi } from "vitest";
import { checkRateLimit, resetRateLimitStore } from "@/lib/services/rateLimitService";
import { sendRsvpConfirmationEmail } from "@/lib/services/emailService";
import { Rsvp } from "@/lib/types";
import nodemailer from "nodemailer";

describe("RateLimitService", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it("allows requests under the threshold and decrements remaining", () => {
    const identifier = "test-client-1";
    const limit = 3;
    const windowMs = 10000;

    const res1 = checkRateLimit(identifier, limit, windowMs);
    expect(res1.success).toBe(true);
    expect(res1.limit).toBe(3);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(identifier, limit, windowMs);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(identifier, limit, windowMs);
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("returns success: false when requests exceed limit within windowMs", () => {
    const identifier = "test-client-2";
    const limit = 2;
    const windowMs = 10000;

    checkRateLimit(identifier, limit, windowMs);
    checkRateLimit(identifier, limit, windowMs);

    const resOver = checkRateLimit(identifier, limit, windowMs);
    expect(resOver.success).toBe(false);
    expect(resOver.remaining).toBe(0);
  });
});

describe("EmailService", () => {
  const dummyRsvp: Rsvp = {
    _id: "507f1f77bcf86cd799439011",
    guestName: "Alice Graduate",
    email: "alice@example.com",
    attending: true,
    message: "So proud of you!",
    selectedGift: null,
  };

  it("returns simulated success without throwing when API key is missing or simulated", async () => {
    const originalHost = process.env.SMTP_HOST;
    delete process.env.SMTP_HOST;

    const res = await sendRsvpConfirmationEmail(dummyRsvp);
    expect(res.success).toBe(true);
    expect(res.id).toBe("dev_simulated");

    if (originalHost) {
      process.env.SMTP_HOST = originalHost;
    }
  });

  it("handles sendMail errors without throwing unhandled exceptions", async () => {
    process.env.SMTP_HOST = "smtp.test.com";
    process.env.SMTP_USER = "testuser";
    process.env.SMTP_PASS = "testpass";

    const mockSendMail = vi.fn().mockRejectedValueOnce(new Error("SMTP connection error"));
    const mockCreateTransport = vi.spyOn(nodemailer, "createTransport").mockReturnValue({
      sendMail: mockSendMail,
    } as unknown as ReturnType<typeof nodemailer.createTransport>);

    const res = await sendRsvpConfirmationEmail(dummyRsvp);
    expect(res.success).toBe(false);
    expect(res.error).toBe("SMTP connection error");

    mockCreateTransport.mockRestore();
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
  });
});
