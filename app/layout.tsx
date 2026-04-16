import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrustHub — Auditez vos contrats B2B gratuitement",
  description:
    "Auditez vos contrats B2B en 5 min avec l'IA. Détectez les clauses pièges, les dérives tarifaires et les écarts entre promesses et facturation. 100% gratuit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
