import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendEmail = async (to,html) => {
    try {
    if (!resend) {
      console.warn("Resend API key not configured. Email not sent.");
      return { message: "Email service not configured" };
    }
    const response = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [to],
      subject:"Password reset Link",
      html,
    });

    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}