import Header from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Teachers from "@/components/teachers";
import PlatformFeatures from "@/components/platform-features";
import LeadForm from "@/components/lead-form";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import AiChat from "@/components/ai-chat";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Teachers />
      <PlatformFeatures />
      <LeadForm />
      <Pricing />
      <Testimonials />
      <Footer />
      <AiChat />
    </div>
  );
}
