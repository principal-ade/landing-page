import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import ClientThemeProvider from "@/components/providers/ClientThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Principal-ade - The Principal Engineer for Your Codebase",
  description: "AI-powered principal engineering assistant that helps you make better architectural decisions and maintain code quality at scale.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover", // For iPhone X+ notch
  },
  themeColor: "#1a1a1a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Principal-ade",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased h-full`}
      >
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
