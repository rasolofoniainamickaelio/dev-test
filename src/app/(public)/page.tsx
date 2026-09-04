import { CoverageNotice } from '@/features/home/components/CoverageNotice';
import { Hero } from '@/features/home/components/Hero';
import { ServiceList } from '@/features/home/components/ServiceList';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceList />
      <CoverageNotice />
    </>
  );
}
