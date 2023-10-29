"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Modal from "./Modal";
import Spinner from "./Spinner";
import { BookingStatus } from "./enum";

// Define the interface for the booking data
interface Booking {
  id: number;
  name: string;
  date: Date;
  time: string;
  facility: string;
  status: string;
}

function BookingFacilitiesList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(BookingStatus.APPROVED);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Create a variable to track if the component is still mounted

    // Inside the effect, set up the fetch request and state update
    fetch("/api/bookings")
      .then((response) => response.json())
      .then((data: Booking[]) => {
        if (isMounted) {
          // Check if the component is still mounted
          setBookings(data);
          setLoading(false);
        }
      });

    // Return a cleanup function to handle unmounting
    return () => {
      isMounted = false; // Set isMounted to false when the component unmounts
    };
  }, []);

  const confirmDelete = (booking: Booking) => {
    setBookingToDelete(booking);
    setShowDeleteConfirmation(true);
  };

  const resetDeleteConfirmation = () => {
    setBookingToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleDelete = (id: number) => {
    fetch(`/api/bookings/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 204) {
          // Deletion successful (status code 204)
          setBookings((prevBookings) =>
            prevBookings.filter((booking) => booking.id !== id)
          );
          setLoading(false);
          console.log(`Booking ${id} has been deleted.`);
        } else {
          console.error("Failed to delete booking.");
        }
      })
      .catch((error) => {
        console.error("Error deleting booking:", error);
      });
  };

  const openModal = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as BookingStatus;
    setSelectedStatus(selectedValue);
  };

  const handleSaveStatusChange = async () => {
    if (!selectedStatus) {
      console.error("Invalid data for status change.");
      closeModal();
      return;
    }

    try {
      const updatedBooking = bookings.find(
        (booking) => booking.id === selectedBookingId
      );

      if (updatedBooking) {
        updatedBooking.status = selectedStatus;

        const res = await fetch(`/api/bookings/${updatedBooking.id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(updatedBooking),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`Failed to update booking: ${errorData.message}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Define a function to determine the row's CSS class based on booking.status
  const getRowClass = (status: string) => {
    console.log(status);
    if (status === BookingStatus.APPROVED) {
      return "bg-green-300";
    } else if (status === BookingStatus.CANCELLED) {
      return "bg-red-300";
    }
    return ""; // Default class
  };

  return useMemo(() => {
    if (loading) {
      return (
        <div className="text-center bg-gray-100 p-4 rounded-lg shadow-lg">
          <Spinner />
        </div>
      );
    }

    if (bookings.length === 0) {
      return (
        <div className="text-center bg-gray-100 p-4 rounded-lg shadow-lg">
          No records found
        </div>
      );
    }

    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              {/* <th className="px-4 py-2">ID</th> */}
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Booking Date</th>
              <th className="px-4 py-2">Booking Time</th>
              <th className="px-4 py-2">Facility</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                className={`text-center ${getRowClass(booking.status)}`}
                key={booking.id}
              >
                {/* <td className="px-4 py-2">{booking.id}</td> */}
                <td className="px-4 py-2 text-left">{booking.name}</td>
                <td className="px-4 py-2">
                  {new Date(booking.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{booking.time}</td>
                <td className="px-4 py-2 text-left">{booking.facility}</td>
                <td className="px-4 py-2">{booking.status}</td>
                <td>
                  <Link href={`/editBooking/${booking.id}`}>
                    <button className="px-2 py-1 bg-blue-500 text-white mr-2">
                      Edit
                    </button>
                  </Link>
                  <button
                    className="px-2 py-1 bg-red-500 text-white mr-2"
                    onClick={() => confirmDelete(booking)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-2 py-1 bg-blue-500 text-white"
                    onClick={() => openModal(booking.id)}
                  >
                    Change Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Change Booking Status"
          onSave={() => {
            // Handle save logic here
            console.log("Selected status:", selectedStatus);
            handleSaveStatusChange();
            setShowModal(false);
          }}
        >
          <div className="mb-4">
            <label className="block" htmlFor="statusSelect">
              Status:
              <select
                className="border p-2"
                id="statusSelect"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="APPROVED">{BookingStatus.APPROVED}</option>
                <option value="CANCELLED">{BookingStatus.CANCELLED}</option>
              </select>
            </label>
          </div>
        </Modal>

        <Modal
          isOpen={showDeleteConfirmation}
          onClose={resetDeleteConfirmation}
          title="Confirm Deletion"
          onSaveButtonLabel="Yes"
          onCloseButtonLabel="No"
          onSave={() => {
            if (bookingToDelete) {
              // Handle delete logic here
              handleDelete(bookingToDelete.id); // Pass the booking ID for deletion
              resetDeleteConfirmation();
            }
          }}
        >
          <p>Are you sure you want to delete this booking?</p>
        </Modal>
      </div>
    );
  }, [loading, bookings, showDeleteConfirmation, showModal, selectedStatus]);
}

export default BookingFacilitiesList;
