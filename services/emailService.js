import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// 📨 Create a reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // uses Gmail SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendAdviceEmail(to, subject, adviceText, plotName, cropName, location) {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #2e7d32;">🌾 Crop Advisory Update</h2>
        <p>Hello Farmer,</p>
        <p>Here is your latest crop advisory for your plot 
        <strong>${plotName}</strong> (${location}) where you are cultivating <strong>${cropName}</strong>:</p>

        <div style="background-color: #f0fdf4; border-left: 5px solid #2e7d32; padding: 12px; margin: 15px 0;">
          <p style="margin: 0;">${adviceText}</p>
        </div>

        <p>Keep monitoring your field regularly and take action as advised to ensure a healthy yield.</p>

        <p style="margin-top: 20px;">Warm regards,<br/>
        <strong>🌱 Crop Advisory Team</strong><br/>
        <small>Automated Farm Monitoring System</small></p>
      </div>
    `;

    const mailOptions = {
      from: `"Crop Advisory Team 🌾" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Advisory Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw error;
  }
}
