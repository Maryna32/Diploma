import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "TraceLog",
  description:
    "Ваш особистий щоденник для відстеження переглянутих фільмів та прочитаних книг. Зберігайте свої медіаінтереси, аналізуйте прогрес та діліться досягненнями з друзями.",
  keywords:
    "TraceLog, трекер інтересів, трекер книг, трекер фільмів, дипломна робота",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <>
          <Navbar />
          {children}
        </>
      </body>
    </html>
  );
}
