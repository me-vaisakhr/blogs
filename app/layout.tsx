import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import { Footer } from "./components/Footer";
import { Logo } from "./components/Logo";

export const metadata: Metadata = {
  title: "Journey - Thoughts & Learnings",
  description: "Thoughts, learnings, and experiences from my journey in software development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-gray-100 transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <nav className="sticky top-0 z-50 bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-dark-border">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <a href="/" className="text-gray-900 dark:text-gray-100" title="Journey of Vaisakh">
                  <Logo size="lg" />
                </a>
                <ThemeToggle />
              </div>
            </div>
          </nav>
          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
