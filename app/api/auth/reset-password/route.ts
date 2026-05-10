import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcrypt"

import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

const resetSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = resetSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      slug: parsed.data.slug,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: true,
    },
  })

  if (!resetToken?.user) {
    return NextResponse.json(
      { error: "Reset link is invalid or expired" },
      { status: 400 }
    )
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ])

  return NextResponse.json({ ok: true })
}
