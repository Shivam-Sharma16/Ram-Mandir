import Contact from "@/src/components/contact/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Shree Ram Mandir",
    description: "Contact Shree Ram Mandir — enquiries, venue bookings, pooja reservations, donation queries, and more.",
};

export default function ContactPage() {
    return (
        <main>
            <Contact />
        </main>
    );
}
