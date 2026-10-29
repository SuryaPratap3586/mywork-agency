import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div id="top" />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
