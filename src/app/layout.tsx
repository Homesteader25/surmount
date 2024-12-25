import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/app/components/NavBar"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Productivity App",
  description: "Created by Joseph Davenport",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let items = [
    { name: 'Dashboard', href: '/', current: true},
    { name: 'Projects', href: '/', current: false },
    { name: 'Solution Log', href: '/solutions', current: false },
  ]
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div> <NavBar imageSrcPath="/briefcase.svg" navItems = {items}/> </div>
        {children}
      </body>
    </html>
  );
}
