import { Metadata } from "next";
import HomeContent from "@/src/components/home/HomeContent";

export const metadata: Metadata = {
    title: "Shree Ram Mandir Ayodhya | Official Home",
    description: "Experience the divine grace of Shree Ram Mandir, Ayodhya. Explore the sacred precincts and participate in the legacy of Maryada Purushottam Shree Ram.",
    keywords: ["Ram Mandir", "Ayodhya", "Panchang 2026", "Ram Navami", "Hinduism"],
};

export default function HomePage() {
    return (
        <main>
            <HomeContent />
        </main>
    );
}