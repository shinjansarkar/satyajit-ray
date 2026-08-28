import { Anek_Bangla, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const anekBangla = Anek_Bangla({
  subsets: ["bengali", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-anek",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-hind",
});

export const metadata = {
  title: "Manik Da - Satyajit Ray Tribute",
  description: "A tribute to Satyajit Ray",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${anekBangla.variable} ${hindSiliguri.variable}`}>
      <body className="dark-theme is-playing">
        {children}
      </body>
    </html>
  );
}
