import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail = async (to, otp) => {
    const now = new Date();
    const expireTime = new Date(now.getTime() + 5 * 60 * 1000);
    const expireTimeStr = expireTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: "Reset your password",
        html: `<p>Your OTP for password reset is <b>${otp}</b>. It will expire at <b>${expireTimeStr}</b>.</p>`
    });
}