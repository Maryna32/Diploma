import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "next-themes";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
