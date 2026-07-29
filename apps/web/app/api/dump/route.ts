import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ url: process.env.POSTGRES_URL });
}
