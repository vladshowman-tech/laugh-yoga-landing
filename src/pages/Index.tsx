import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import WhatIs from '@/components/site/WhatIs';
import HowItGoes from '@/components/site/HowItGoes';
import Benefits from '@/components/site/Benefits';
import Coach from '@/components/site/Coach';
import Reviews from '@/components/site/Reviews';
import Pricing from '@/components/site/Pricing';
import Faq from '@/components/site/Faq';
import Booking from '@/components/site/Booking';
import Footer from '@/components/site/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-hero-bg font-body">
      <Header />
      <main>
        <Hero />
        <WhatIs />
        <HowItGoes />
        <Benefits />
        <Coach />
        <Reviews />
        <Pricing />
        <Faq />
        <Booking />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
