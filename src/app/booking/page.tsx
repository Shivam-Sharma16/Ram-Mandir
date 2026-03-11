import Booking from "@/src/components/booking/Booking";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Booking | Shree Ram Mandir",
    description: "Book sacred venues at Shree Ram Mandir — marriage gardens, event halls, satsang halls, and more for your celebrations and ceremonies.",
};

export default function BookingPage() {
    return (
        <main>
            <Booking />
        </main>
    );
}
