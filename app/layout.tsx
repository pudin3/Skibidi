import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import AdminFab from "@/components/AdminFab";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "Memori Presentasi",
  description: "Materi presentasi kelas dan sesi tanya jawab.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sora.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        {/* Dimuat lewat CDN (bukan import npm) agar custom element <model-viewer>
            terdaftar dengan aman di browser tanpa masalah SSR. */}
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js"
          strategy="beforeInteractive"
        />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#0F2244",
              color: "#fff",
              fontFamily: "var(--font-body)",
            },
          }}
        />
        {children}
        <AdminFab />
      </body>
    </html>
  );
}
