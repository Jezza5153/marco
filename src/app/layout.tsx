import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.marcojonk.nl"),
  title: "🎉 Verrassingsfeest voor Marco Jonk",
  description:
    "Je bent uitgenodigd voor het verrassingsfeest van Marco! RSVP nu en laat weten of je erbij bent.",
  openGraph: {
    title: "🎉 Verrassingsfeest voor Marco Jonk",
    description:
      "Je bent uitgenodigd voor het verrassingsfeest! Laat weten of je komt 🎊",
    type: "website",
    url: "https://www.marcojonk.nl",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Verrassingsfeest voor Marco Jonk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🎉 Verrassingsfeest voor Marco Jonk",
    description:
      "Je bent uitgenodigd voor het verrassingsfeest! Laat weten of je komt 🎊",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎉</text></svg>"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-navy)]">
        {children}
      </body>
    </html>
  );
}
