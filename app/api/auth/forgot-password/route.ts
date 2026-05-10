import { NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"

import { prisma } from "@/lib/prisma"
import { mailer, buildFromAddress } from "@/lib/email"

export const runtime = "nodejs"

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
})

const TOKEN_TTL_MS = 60 * 60 * 1000

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = forgotSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const email = parsed.data.email.toLowerCase()
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  })

  if (user) {
    const token = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS)

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const resetUrl = new URL("/auth/reset-password", baseUrl)
    resetUrl.searchParams.set("token", token)

    await mailer.sendMail({
      from: buildFromAddress(),
      to: user.email || email,
      subject: "Reset your Traveloop password",
      text: `We received a request to reset your password.\n\nReset it here: ${resetUrl.toString()}\n\nIf you did not request this, you can ignore this email.`,
      html: `
        <p>We received a request to reset your password.</p>
        <p><a href="${resetUrl.toString()}">Reset your password</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    })
  }

  return NextResponse.json({ ok: true })
}
