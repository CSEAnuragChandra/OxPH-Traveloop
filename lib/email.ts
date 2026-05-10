const brevoApiKey = process.env.BREVO_API_KEY
const fromEmail = process.env.EMAIL_FROM
const fromName = process.env.EMAIL_FROM_NAME || "Traveloop"

if (!brevoApiKey || !fromEmail) {
  throw new Error(
    "Missing Brevo env vars. Set BREVO_API_KEY and EMAIL_FROM."
  )
}

type MailAddress = {
  name?: string
  address: string
}

type SendMailParams = {
  from: MailAddress
  to: string | string[]
  subject: string
  text?: string
  html?: string
}

export async function sendMail({
  from,
  to,
  subject,
  text,
  html,
}: SendMailParams) {
  const recipients = Array.isArray(to) ? to : [to]
  const payload = {
    sender: {
      name: from.name || fromName,
      email: from.address,
    },
    to: recipients.map((email) => ({ email })),
    subject,
    textContent: text,
    htmlContent: html,
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoApiKey,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "")
    throw new Error(
      `Brevo send failed: ${response.status} ${response.statusText} ${errorBody}`
    )
  }
}

export function buildFromAddress() {
  return {
    name: fromName,
    address: fromEmail,
  }
}
