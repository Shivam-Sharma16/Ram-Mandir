import About from "@/src/components/about/About";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Shree Ram Mandir Jaipur",
    description: "Learn about the history, trust, and divine legacy of Shree Ram Mandir, Jaipur.",
};

export default function AboutPage() {
    return (
        <main>
            <About />
        </main>
    );
}
