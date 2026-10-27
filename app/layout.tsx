import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustValue Headless CMS — Editorial & Governance Core",
  description: "Enterprise Headless CMS and Subdomain Governance Platform for TrustValue.ai",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
