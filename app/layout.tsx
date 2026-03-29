import "../styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontInter } from "@/config/fonts";
import { Navbar } from "@/components/Navbar/navbar";
import { Footer } from "@/components/Footer/footer";
import BackgroundImage from "@/components/BackgroundImage/backgroundImage";
import ToastProvider from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f4f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0C2856" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className="min-h-screen">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground font-sans bg-cover bg-center bg-no-repeat w-full bg-[url('/background-light.png')] dark:bg-[url('/background-black.png')]",
          fontInter.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <BackgroundImage />
          <div className="relative flex flex-col min-h-screen">
            <Navbar />
            <main className="w-full max-w-full mx-auto flex-grow flex flex-col items-stretch justify-center overflow-x-hidden px-4 sm:px-6 md:px-0">
              {children}
              <ToastProvider />
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
