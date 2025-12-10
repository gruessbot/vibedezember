import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gemeinsamer Terminkalender",
  description: "Trage deine Termine ein und sehe, was andere geplant haben",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
