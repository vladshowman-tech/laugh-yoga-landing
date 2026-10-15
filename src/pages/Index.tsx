import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import WhatIs from '@/components/site/WhatIs';
import HowItGoes from '@/components/site/HowItGoes';
import Benefits from '@/components/site/Benefits';
import Coach from '@/components/site/Coach';
import Schedule from '@/components/site/Schedule';
import Reviews from '@/components/site/Reviews';
import Pricing from '@/components/site/Pricing';
import Faq from '@/components/site/Faq';
import Footer from '@/components/site/Footer';
import { useSiteContent } from '@/hooks/useSiteContent';

const Index = () => {
  const { data, isLoading, isError } = useSiteContent();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hero-bg font-head text-3xl font-black text-hero-text">
        ХО-ХО-ХА-ХА
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hero-bg px-5 text-center font-body text-lg text-hero-text">
        Не удалось загрузить сайт. Обновите страницу через минуту.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-bg font-body">
      <Header showSchedule={data.schedule?.enabled !== false && (data.schedule?.events?.length ?? 0) > 0} />
      <main>
        <Hero data={data.hero || {}} />
        <WhatIs data={data.what || {}} />
        <HowItGoes data={data.how || {}} />
        <Benefits data={data.benefits || {}} />
        <Coach data={data.coach || {}} />
        <Schedule data={data.schedule || {}} />
        <Reviews data={data.reviews || {}} />
        <Pricing data={data.pricing || {}} />
        <Faq data={data.faq || {}} />
      </main>
      <Footer data={data.footer || {}} contacts={data.contacts?.items || []} />
    </div>
  );
};

export default Index;