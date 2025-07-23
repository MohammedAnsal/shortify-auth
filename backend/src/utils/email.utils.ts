import nodemailer from "nodemailer";

const { EMAIL_USER, EMAIL_PASS } = process.env;
if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error("Missing required environment variables for email sending.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

interface SendVerificationEmailOptions {
  email: string;
  token: string;
}

export const sendVerificationEmail = async ({
  email,
  token,
}: SendVerificationEmailOptions): Promise<void> => {
  // const link = `${BASE_URL}/verify-email?token=${token}`;
  const link = `http://localhost:7002/auth/verify-email?email=${email}&token=${token}`;

  const mailOptions = {
    from: `"Shortify Auth" <${EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fafbfc;">
        <h2 style="color: #333;">Welcome to <span style="color: #4CAF50;">Shortify Auth</span> 👋</h2>
        <p style="font-size: 16px; color: #555;">Please verify your email by clicking the button below:</p>
        <a href="${link}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #4CAF50; color: #fff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Verify Email
        </a>
        <p style="font-size: 14px; color: #888;">This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="font-size: 12px; color: #bbb;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
