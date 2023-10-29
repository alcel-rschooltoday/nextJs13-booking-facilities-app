import EditBookingForm from "@/app/components/EditBookingForm";

const getBookingById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/bookings/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch booking");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error; // Re-throw the error so it's propagated to the caller
  }
};

export default async function EditBooking({ params }) {
  try {
    const { id } = params;
    const booking = await getBookingById(id);
    const { name, date, time, facility } = booking;

    return (
      <EditBookingForm
        id={id}
        name={name}
        date={date}
        time={time}
        facility={facility}
      />
    );
  } catch (error) {
    console.error("Error in EditBooking:", error);
    // Handle the error gracefully, e.g., show an error message to the user
    return <div>Error: Failed to fetch booking</div>;
  }
}
