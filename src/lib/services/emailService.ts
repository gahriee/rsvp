import { Rsvp as RsvpInterface, EmailSendResult, Gift as GiftInterface } from "@/lib/types";
import { Gift } from "@/models/Gift";
import { connectToDatabase } from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function sendRsvpConfirmationEmail(
  rsvp: RsvpInterface
): Promise<EmailSendResult> {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.SMTP_FROM || process.env.FROM_EMAIL || "celebration@graduate.com";

    let giftName: string | null = null;
    if (rsvp.selectedGift) {
      try {
        await connectToDatabase();
        const giftDoc = await Gift.findById(rsvp.selectedGift).lean();
        if (giftDoc) {
          giftName = (giftDoc as unknown as GiftInterface).name;
        }
      } catch (err) {
        console.error("Failed to fetch gift details for confirmation email:", err);
      }
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h1 style="color: #4a5568; text-align: center;">Graduation Celebration RSVP</h1>
        <p>Hi ${rsvp.guestName},</p>
        <p>Thank you for submitting your RSVP for the graduation celebration!</p>
        <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2d3748;">Your RSVP Details:</h3>
          <p><strong>Status:</strong> ${rsvp.attending ? "Attending 🎉" : "Not Attending"}</p>
          ${rsvp.attending ? `<p><strong>Guests Attending:</strong> ${rsvp.numberOfGuests}</p>` : ""}
          ${giftName ? `<p><strong>Selected Gift:</strong> ${giftName}</p>` : ""}
          ${rsvp.message ? `<p><strong>Your Message:</strong> "${rsvp.message}"</p>` : ""}
        </div>
        <p style="font-size: 14px; color: #718096; text-align: center;">We look forward to celebrating with you!</p>
      </div>
    `.trim();

    if (!smtpHost || !smtpUser || !smtpPass) {
      if (process.env.NODE_ENV !== "test") {
        console.info(`[DEV EMAIL SIMULATION] To: ${rsvp.email} | Status: ${rsvp.attending ? "Attending" : "Declined"}`);
      }
      return {
        success: true,
        id: "dev_simulated",
      };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: fromEmail,
      to: rsvp.email,
      subject: `RSVP Confirmation - ${rsvp.attending ? "We're excited to see you!" : "Thank you for letting us know"}`,
      html: htmlContent,
    });

    return {
      success: true,
      id: info.messageId || "nodemailer_dispatched",
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Error sending RSVP confirmation email:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
