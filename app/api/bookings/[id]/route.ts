import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // Check if the booking with the provided ID exists
    const existingBooking = await prisma.booking.findFirst({
      where: { id: parseInt(id) },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const deletedBooking = await prisma.booking.delete({
      where: { id: parseInt(id) },
    });

    if (!deletedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
