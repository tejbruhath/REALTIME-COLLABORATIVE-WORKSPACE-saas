import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-white dark:bg-black text-gray-900 dark:text-white transition-colors`}>
        <ThemeProvider>
          <SessionProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "dark:bg-gray-800 dark:text-white bg-white text-gray-900",
                style: {
                  border: "1px solid",
                  borderColor: "rgb(31 41 55)",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
