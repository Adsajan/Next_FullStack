import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { userSchema } from "@/lib/validations/user";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch users.", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = userSchema.parse(body);

    await connectToDatabase();
    const created = await User.create(payload);

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    const duplicate = (error as { code?: number })?.code === 11000;
    if (duplicate) {
      return NextResponse.json({ message: "Email already exists." }, { status: 409 });
    }

    return NextResponse.json(
      { message: "Failed to create user.", error: (error as Error).message },
      { status: 400 }
    );
  }
}
