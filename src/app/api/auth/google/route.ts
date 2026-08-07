import { signIn } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
  await signIn("google")
  return NextResponse.redirect("/")
}
