import type { Metadata } from 'next';
import ServicesContent from './ServicesContent';

export const metadata: Metadata = {
  title: 'WP Fire - Services',
  description:
    'Professional fire alarm installation, emergency lighting, and security systems across London & South East England. BAFE-certified technicians, 24/7 support, free site surveys.',
  keywords: [
    'fire alarm installation',
    'emergency lighting',
    'security systems',
    'CCTV',
    'intruder alarms',
    'access control',
    'London fire safety',
  ],
  openGraph: {
    title: 'Fire Alarm Installation & Security Services | WP Fire',
    description:
      'Professional fire alarm installation, emergency lighting, and security systems across London & South East England. BAFE-certified technicians, 24/7 support.',
    url: 'https://wpfire.co.uk/services',
  },
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
