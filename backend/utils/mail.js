import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail Configuration Error:", error);
  } else {
    console.log("✅ Gmail SMTP Connected");
  }
});

export const sendOtpMail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Vingo" <${process.env.EMAIL}>`,
      to: to,
      subject: "Reset Your Password",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Vingo Password Reset</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#ff5722;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
        </div>
      `,
    });

    console.log("✅ OTP Email Sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to Send OTP:", error);
    throw error;
  }
};

export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Vingo" <${process.env.EMAIL}>`,
      to: user.email,
      subject: "Delivery OTP",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Vingo Delivery OTP</h2>
          <p>Your Delivery OTP is:</p>
          <h1 style="color:#28a745;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
        </div>
      `,
    });

    console.log("✅ Delivery OTP Sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to Send Delivery OTP:", error);
    throw error;
  }
};
