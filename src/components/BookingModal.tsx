"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/booking";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IStudio } from "@/data/mockData";
import { useNavigate } from "react-router";

interface BookingModalProps {
  studio: IStudio;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({
  studio,
  isOpen,
  onClose,
}: BookingModalProps) {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (date) {
      // Generate time slots based on studio availability
      const slots = generateTimeSlots(
        studio.Availability.Open,
        studio.Availability.Close
      );

      // Check which slots are already booked
      const bookedSlots = getBookedSlots(studio.Id, date);

      // Filter out booked slots
      const available = slots.filter((slot) => !bookedSlots.includes(slot));

      setAvailableTimeSlots(available);
      setTimeSlot("");
    }
  }, [date, studio]);

  const generateTimeSlots = (openTime: string, closeTime: string) => {
    const slots = [];
    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);

    let currentHour = openHour;
    const currentMinute = openMinute;

    while (
      currentHour < closeHour ||
      (currentHour === closeHour && currentMinute < closeMinute)
    ) {
      const formattedHour = currentHour.toString().padStart(2, "0");
      const formattedMinute = currentMinute.toString().padStart(2, "0");

      slots.push(`${formattedHour}:${formattedMinute}`);

      // Add 1 hour for each slot
      currentHour += 1;

      // If we've gone past 23:59, reset to 00:00
      if (currentHour >= 24) {
        currentHour = 0;
      }
    }

    return slots;
  };

  const getBookedSlots = (studioId: number, selectedDate: Date) => {
    const bookings = JSON.parse(
      localStorage.getItem("studioBookings") || "[]"
    ) as Booking[];

    return bookings
      .filter(
        (booking) =>
          booking.studioId === studioId &&
          new Date(booking.date).toDateString() === selectedDate.toDateString()
      )
      .map((booking) => booking.timeSlot);
  };

  const handleSubmit = () => {
    setBookingError(null);

    // Validate form
    if (!date) {
      setBookingError("Please select a date");
      return;
    }

    if (!timeSlot) {
      setBookingError("Please select a time slot");
      return;
    }

    if (!name.trim()) {
      setBookingError("Please enter your name");
      return;
    }

    if (!email.trim()) {
      setBookingError("Please enter your email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setBookingError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // Check if the slot is still available (in case someone else booked it)
    const bookedSlots = getBookedSlots(studio.Id, date);
    if (bookedSlots.includes(timeSlot)) {
      setBookingError(
        "This time slot is no longer available. Please select another time."
      );
      setIsSubmitting(false);
      return;
    }

    // Create booking object
    const booking: Booking = {
      id: `booking-${Date.now()}`,
      studioId: studio.Id,
      studioName: studio.Name,
      studioType: studio.Type,
      location: `${studio.Location.Area}, ${studio.Location.City}`,
      date: date.toISOString(),
      timeSlot: timeSlot,
      userName: name,
      userEmail: email,
      createdAt: new Date().toISOString(),
    };

    // Save to local storage
    const existingBookings = JSON.parse(
      localStorage.getItem("studioBookings") || "[]"
    );
    localStorage.setItem(
      "studioBookings",
      JSON.stringify([...existingBookings, booking])
    );

    // Show success message
    setBookingSuccess(true);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setDate(undefined);
    setTimeSlot("");
    setName("");
    setEmail("");
    setBookingError(null);
    setBookingSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {bookingSuccess ? "Booking Confirmed!" : `Book ${studio.Name}`}
          </DialogTitle>
          <DialogDescription>
            {bookingSuccess
              ? "Your booking has been successfully confirmed. You can view all your bookings in the bookings page."
              : `${studio.Type} - ${studio.Location.Area}, ${studio.Location.City}`}
          </DialogDescription>
        </DialogHeader>

        {bookingSuccess ? (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Booking Successful
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Your studio has been booked for:</p>
                    <p className="font-medium mt-1">
                      {date &&
                        date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                    </p>
                    <p className="font-medium">{timeSlot}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={() => navigate("/bookings")}>
                View My Bookings
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {bookingError && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{bookingError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="date">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                      ? date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {date && availableTimeSlots.length > 0 ? (
              <div className="space-y-2">
                <label>Select Time Slot</label>
                <RadioGroup value={timeSlot} onValueChange={setTimeSlot}>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map((slot) => (
                      <div key={slot}>
                        <RadioGroupItem
                          value={slot}
                          id={`time-${slot}`}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={`time-${slot}`}
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          {slot}
                        </label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ) : date ? (
              <div className="text-center py-2 text-muted-foreground">
                No available time slots for this date
              </div>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="name">Your Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email">Your Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
