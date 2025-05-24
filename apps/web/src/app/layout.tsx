import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Custom Spotify",
  description: "Votre application Spotify personnalisée",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
