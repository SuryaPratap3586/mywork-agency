import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "MyWorkAgency | Digital Marketing, Design and Development",
    template: "%s | MyWorkAgency",
  },
  description:
    "MyWorkAgency plans, designs and builds campaigns, websites and apps that bring in qualified leads.",
};

// Light theme only: tell the browser not to apply dark UI to form controls, scrollbars, etc.
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-white font-[family-name:var(--font-body)] text-[#0F1330] antialiased">
        {children}
      </body>
    </html>
  );
}
