const config = require('../config/env');

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (config.email.host && config.email.user) {
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }
  return transporter;
}

exports.sendOtpEmail = async (email, otp) => {
  const t = await getTransporter();

  if (!t) {
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return { sent: false, devMode: true, otp };
  }

  await t.sendMail({
    from: config.email.from,
    to: email,
    subject: 'Your RecipeRec OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #16a34a;">RecipeRec Verification</h2>
        <p>Your OTP code is:</p>
        <div style="font-size: 32px; font-weight: bold; color: #16a34a; letter-spacing: 8px; text-align: center; padding: 16px; background: #f0fdf4; border-radius: 12px;">
          ${otp}
        </div>
        <p>This code expires in 10 minutes.</p>
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });

  return { sent: true };
};

exports.sendWelcomeEmail = async (email, username) => {
  const t = await getTransporter();

  if (!t) {
    console.log(`[DEV] Welcome email for ${username} <${email}>`);
    return { sent: false, devMode: true };
  }

  await t.sendMail({
    from: config.email.from,
    to: email,
    subject: 'Welcome to RecipeRec!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Welcome, ${username}! 🎉</h2>
        <p>Your RecipeRec account has been created successfully.</p>
        <p>Now you can:</p>
        <ul>
          <li>Discover recipes tailored to your taste</li>
          <li>Write and share food blogs</li>
          <li>Chat with our AI chef assistant</li>
          <li>Save your favorite recipes</li>
        </ul>
        <p>Happy cooking! 🍳</p>
        <p style="color: #666;">— The RecipeRec Team</p>
      </div>
    `,
  });

  return { sent: true };
};
