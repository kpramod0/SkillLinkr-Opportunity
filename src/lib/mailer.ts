import nodemailer from 'nodemailer'

export const sendOtpEmail = async (to: string, otpCode: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  })

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0891b2;">Verify Your Society Registration</h2>
      <p>Hello,</p>
      <p>Thank you for registering your society on SkillLinkr Opportunities. Please use the following One-Time Password (OTP) to verify your official email address and proceed with your onboarding:</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827;">${otpCode}</span>
      </div>
      
      <p style="font-size: 14px; color: #6b7280;">This code will expire in 10 minutes. If you did not request this verification, please ignore this email.</p>
      <br />
      <p>Best regards,<br/>The SkillLinkr Team</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: '"SkillLinkr Opportunities" <skillinkr@gmail.com>',
      to,
      subject: 'Your SkillLinkr Verification Code',
      html,
    })
  } catch (err: any) {
    console.error("⚠️ SMTP Error: Failed to send email.", err.message)
    throw new Error("Failed to send verification email. Please try again later.")
  }
}
