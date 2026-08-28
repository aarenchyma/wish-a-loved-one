import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://wish-a-loved-one.com"),
  title: {
    default: "Wish A Loved One — Send a wish they'll remember",
    template: "%s | Wish A Loved One",
  },
  description:
    "Send a personalized birthday, valentine, or anniversary wish as an animated page — shared as a link, a QR code, or straight to their inbox.",
  keywords: [
    "birthday wish",
    "personalized greeting",
    "digital gift",
    "QR code gift",
    "online wish card",
    "valentine wish",
    "anniversary wish",
  ],
  openGraph: {
    title: "Wish A Loved One — Send a wish they'll remember",
    description:
      "A personalized page with your message — delivered as a link, QR code, or email. No app required to open it.",
    url: "https://wish-a-loved-one.com",
    siteName: "Wish A Loved One",
    locale: "en_NG",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wish A Loved One — Send a wish they'll remember",
    description:
      "A personalized page with your message — delivered as a link, QR code, or email.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">{children}</body>
    </html>
  );
}