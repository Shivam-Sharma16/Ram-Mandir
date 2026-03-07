// src/app/page.tsx
import { Metadata } from "next";
import HeroSection from "@/src/components/home/HeroSection";
import TempleOverview from "@/src/components/home/TempleOverview";
import DonationSection from "@/src/components/home/DonationSection";
import EventsSection from "@/src/components/home/EventsSection";

export const metadata: Metadata = {
    title: "Shree Ram Mandir Ayodhya | Official Home",
    description: "Experience the divine grace of Shree Ram Mandir, Ayodhya. Explore the 8 sacred Garbhagrihas, participate in upcoming events, and contribute to the temple's legacy.",
    keywords: ["Ram Mandir", "Ayodhya", "Donation", "Temple Events", "Garbhagriha", "Hinduism"],
};

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <TempleOverview />
            <DonationSection />
            <EventsSection />
        </>
    );
}
