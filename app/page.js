import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import NarrativeTicker from "@/components/landing/NarrativeTicker";
import StatsBar from "@/components/landing/StatsBar";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink-900">
      <Navbar />
      <Hero />
      <NarrativeTicker />
      <div className="-mt-px">
        <div className="pt-14">
          <StatsBar />
        </div>
      </div>
      <HowItWorks />
      <Features />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
