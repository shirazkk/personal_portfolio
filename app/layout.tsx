import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/providers/LenisProvider";
import { portfolioData } from "@/data/portfolio";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: portfolioData.meta.title,
    template: "%s | Shiraz Abubakar",
  },
  description: portfolioData.meta.description,
  openGraph: {
    title: portfolioData.meta.title,
    description: portfolioData.meta.description,
    url: "https://shirazabubakar.xyz",
    siteName: "Shiraz Abubakar Portfolio",
    images: [
      {
        url: "https://shirazabubakar.xyz/profile.png",
        width: 800,
        height: 600,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: portfolioData.meta.title,
    description: portfolioData.meta.description,
    images: ["https://shirazabubakar.xyz/profile.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${manrope.variable}`}>
      <head>
        <meta
          name="google-site-verification"
          content="HxEe42MKrhWqwDoFend5PiMK1GZHuXi6ADlUcWj6Ulg"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              "mainEntity": {
                "@type": "Person",
                "name": "Shiraz Abubakar",
                "jobTitle": "Full Stack Developer & Agentic AI Engineer",
                "url": "https://shirazabubakar.xyz",
                "image": "https://shirazabubakar.xyz/profile.png",
                "sameAs": [
                  "https://github.com/shirazkk",
                  "https://www.linkedin.com/in/shirazali8",
                  "https://x.com/KkShiraz"
                ],
                "description": portfolioData.meta.description,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Karachi",
                  "addressRegion": "Sindh",
                  "addressCountry": "PK"
                }
              }
            }),
          }}
        />
      </head>
      <body className="bg-[#0a0a0a] text-white font-manrope selection:bg-[#FF6B00] selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#FF6B00] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to main content
        </a>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
