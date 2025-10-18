import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Workspace SaaS - Collaborative Text Editor",
  description: "Professional real-time collaborative workspace platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <SessionProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0A0A0A",
                color: "#ffffff",
                border: "1px solid #1F1F1F",
                borderRadius: "0",
              },
              success: {
                iconTheme: {
                  primary: "#3B82F6",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
