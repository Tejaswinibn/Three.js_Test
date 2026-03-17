import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/HomePage/Header";
import { Plus_Jakarta_Sans } from "next/font/google";
import icon from "@/public/logo/ET Logo-01.webp";
import FooterGate from "@/components/FooterGate";
import RouteChangeFocus from "@/components/RouteChangeFocus";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Enabled Talent",
  description:
    "Enabled Talent is an inclusive career platform connecting people with disabilities to accessible jobs, skills training, and supportive employers worldwide.",

  icons: {
    icon: icon.src,
    apple: icon.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable}  antialiased`}>
        <Header />
        <RouteChangeFocus />
        {children}
        <FooterGate />
      </body>
    </html>
  );
}
