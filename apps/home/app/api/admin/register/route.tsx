import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Admin Register API Not Implemented" }, { status: 501 });
}
