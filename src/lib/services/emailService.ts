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
    let giftLink: string | null = null;
    if (rsvp.selectedGift) {
      try {
        await connectToDatabase();
        const giftDoc = await Gift.findById(rsvp.selectedGift).lean();
        if (giftDoc) {
          const typedGift = giftDoc as unknown as GiftInterface;
          giftName = typedGift.name;
          giftLink = typedGift.productLink || null;
        }
      } catch (err) {
        console.error("Failed to fetch gift details for confirmation email:", err);
      }
    }

    const htmlContent = `
      <div style="background-color: #fdf2f8; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fffcf9; border: 2px solid #fce7f3; border-radius: 12px; padding: 30px; position: relative; color: #334155; box-shadow: 0 8px 30px rgba(0,0,0,0.04);">
          
          <!-- Simulated Washi Tape -->
          <div style="width: 120px; height: 28px; background-color: #fbcfe8; margin: -44px auto 20px; border-radius: 2px; opacity: 0.9; text-align: center; line-height: 28px; font-size: 10px; font-weight: bold; color: #831843; text-transform: uppercase; letter-spacing: 2px;">
            RSVP
          </div>
          
          <h1 style="color: #831843; text-align: center; font-family: Georgia, serif; font-size: 28px; margin-top: 10px; margin-bottom: 24px;">
            ${rsvp.attending ? "We're so excited!" : "Thank you for letting us know"}
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
            Hi <strong>${rsvp.guestName}</strong>,
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
            Thank you for submitting your RSVP for my graduation celebration. Your response has been safely recorded in my scrapbook!
          </p>
          
          <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; margin: 25px 0; border: 2px dashed #fbcfe8;">
            <h3 style="margin-top: 0; color: #be185d; font-family: Georgia, serif; font-size: 18px; margin-bottom: 16px;">Your Details:</h3>
            
            <p style="margin: 10px 0; font-size: 15px;">
              <strong style="color: #831843;">Status:</strong> ${rsvp.attending ? "Attending 🎉" : "Not Attending"}
            </p>
            
            ${giftName ? `
            <div style="margin: 10px 0; font-size: 15px;">
              <strong style="color: #831843;">Selected Gift:</strong> ${giftName}
              ${giftLink ? `<br/><a href="${giftLink}" style="display: inline-block; margin-top: 6px; padding: 6px 12px; background-color: #fbcfe8; color: #831843; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: bold;">View Item Details</a>` : ""}
            </div>` : ""}
            
            ${rsvp.message ? `
            <p style="margin: 10px 0; font-size: 15px;">
              <strong style="color: #831843;">Your Message:</strong><br/>
              <span style="font-style: italic; color: #64748b; display: inline-block; margin-top: 6px; padding-left: 10px; border-left: 3px solid #fbcfe8;">"${rsvp.message}"</span>
            </p>` : ""}
          </div>
          
          <p style="font-size: 16px; color: #ec4899; text-align: center; font-family: Georgia, serif; font-weight: bold; margin-top: 32px; margin-bottom: 0;">
            ${rsvp.attending ? "Can't wait to celebrate with you!" : "You'll be missed!"}
          </p>
          
        </div>
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
