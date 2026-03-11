import type { Metadata } from "next";
import "./globals.css"; // Import your global styles and theme
import SmoothScroll from "@/src/components/common/SmoothScroll";
import Navbar from "@/src/components/common/Navbar/Navbar";
import Footer from "@/src/components/common/Footer/Footer";
import GoogleTranslate from "@/src/components/common/GoogleTranslate";

export const metadata: Metadata = {
  title: "Shree Ram Mandir | Ayodhya",
  description: "Official portal for Shree Ram Mandir, Ayodhya.",
};

// This MUST be a default export for Next.js to recognize it
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>

        {/* Hidden Google Translate Component */}
        <GoogleTranslate />
      </body>
    </html>
  );
}