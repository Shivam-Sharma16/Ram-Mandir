import { Metadata } from "next";
import HomeContent from "@/src/components/home/HomeContent";

export const metadata: Metadata = {
    title: "Shree Ram Mandir Jaipur | Official Home",
    description: "Experience the divine grace of Shree Ram Mandir, Adarsh Nagar, Jaipur. Explore the sacred precincts and participate in the legacy of Lord Shri Ram.",
    keywords: ["Ram Mandir", "Jaipur", "Adarsh Nagar", "Ram Navami", "Hinduism"],
};

export default function HomePage() {
    return (
        <main>
            <HomeContent />
        </main>
    );
}