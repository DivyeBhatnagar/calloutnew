import type { Metadata } from "next";
import "./globals.css";
import "./dashboard.css";
import { AuthProvider } from '../contexts/AuthContext';
import ThemeProvider from '../components/ThemeProvider';

export const metadata: Metadata = {
  title: "CALLOUT ESPORTS - Building India's Ultimate Esports Community",
  description: "Join India's premier esports platform. Compete in tournaments, build your squad, and rise through the ranks in a fair and competitive gaming environment.",
  keywords: "esports, gaming, tournaments, India, competitive gaming, VALORANT, CS2, BGMI",
  authors: [{ name: "CALLOUT ESPORTS Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
