import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newBooking = await prisma.booking.create({
    data: {
      name: body.name,
      date: new Date(body.date),
      time: body.time,
      facility: body.facility,
    },
  });

  return NextResponse.json(newBooking, { status: 201 });
}

export async function GET(request: NextRequest) {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
