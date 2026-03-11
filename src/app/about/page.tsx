import About from "@/src/components/about/About";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Shree Ram Mandir Ayodhya",
    description: "Learn about the history, trust, and divine legacy of Shree Ram Mandir, Ayodhya.",
};

export default function AboutPage() {
    return (
        <main>
            <About />
        </main>
    );
}
