import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { userSchema } from "@/lib/validations/user";
import { User } from "@/models/User";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch user.", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const body = await request.json();
    const payload = userSchema.parse(body);

    await connectToDatabase();
    const { id } = await params;
    const updated = await User.findByIdAndUpdate(id, payload, { new: true }).lean();

    if (!updated) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    const duplicate = (error as { code?: number })?.code === 11000;
    if (duplicate) {
      return NextResponse.json({ message: "Email already exists." }, { status: 409 });
    }

    return NextResponse.json(
      { message: "Failed to update user.", error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const deleted = await User.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete user.", error: (error as Error).message },
      { status: 500 }
    );
  }
}
