import Homebar from "./components/landing/Homebar";
import LandingHero from "./components/landing/LandingHero";
import Problem from "./components/landing/Problem";
import Solution from "./components/landing/Solution";
import HowItWorks from "./components/landing/HowItWorks";
import CTASection from "./components/landing/CTASection";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden w-full bg-[#050505] text-white antialiased min-h-screen font-sans selection:bg-violet-500/30 selection:text-violet-200">
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Top left deep purple glow */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-violet-900/20 blur-[150px] rounded-full mix-blend-screen opacity-50" />
        {/* Bottom right blue glow */}
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen opacity-50" />
      </div>

      <div className="relative z-10">
        <Homebar />
        <LandingHero />
        <Problem />
        <Solution />
        <HowItWorks />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
