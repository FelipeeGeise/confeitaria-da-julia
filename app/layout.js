import { Great_Vibes, Poppins } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-script" });
const sans = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });
export const metadata = {
  title: "Confeitaria da Júlia | Bolos que tornam sua vida mais doce",
  description: "Bolos artesanais feitos com amor, qualidade e carinho para todas as ocasiões. Encomende pelo WhatsApp.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${script.variable} ${sans.variable}`}>
      <body><Loader /><Header /><main>{children}</main><Footer /></body>
    </html>
  );
}
