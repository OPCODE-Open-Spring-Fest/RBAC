import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to,html) => {
    try {
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