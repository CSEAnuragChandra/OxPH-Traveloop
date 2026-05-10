import nodemailer from "nodemailer"

const smtpHost = process.env.BREVO_SMTP_HOST
const smtpPort = Number(process.env.BREVO_SMTP_PORT || 587)
const smtpUser = process.env.BREVO_SMTP_USER
const smtpPass = process.env.BREVO_SMTP_PASS
const fromEmail = process.env.EMAIL_FROM
const fromName = process.env.EMAIL_FROM_NAME || "Traveloop"

if (!smtpHost || !smtpUser || !smtpPass || !fromEmail) {
  throw new Error(
    "Missing Brevo SMTP env vars. Set BREVO_SMTP_HOST, BREVO_SMTP_USER, BREVO_SMTP_PASS, EMAIL_FROM."
  )
}

export const mailer = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
})

export function buildFromAddress() {
  return {
    name: fromName,
    address: fromEmail,
  }
}
