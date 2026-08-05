'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { scroller } from 'react-scroll';
import { useHeaderHeight } from '@/components/Hero/useHeaderHeight';

// export const metadata = {
//   title: "WP Fire - Services",
//   description:
//     "Professional fire alarm installation, emergency lighting, and security systems across London & South East England. BAFE-certified technicians, 24/7 support, free site surveys.",
//   keywords: [
//     "fire alarm installation",
//     "emergency lighting",
//     "security systems",
//     "CCTV",
//     "intruder alarms",
//     "access control",
//     "London fire safety",
//   ],
//   openGraph: {
//     title: "Fire Alarm Installation & Security Services | WP Fire",
//     description:
//       "Professional fire alarm installation, emergency lighting, and security systems across London & South East England. BAFE-certified technicians, 24/7 support.",
//     url: "https://wpfire.co.uk/services",
//     images: [
//       {
//         url: "/images/og-services.jpg",
//         width: 1200,
//         height: 630,
//         alt: "WP Fire Services - Fire Alarm Installation and Security Systems",
//       },
//     ],
//   },
//   alternates: {
//     canonical: "/services",
//   },
// };

export default function ServicesPage() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  // Handle scroll to contact section
  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const sectionId = 'contact-section';

    // Navigate to root and store scroll target
    sessionStorage.setItem('scrollTarget', sectionId);
    router.push('/'); // Navigate to root without hash
  };

  // Handle scroll after navigation
  useEffect(() => {
    const scrollTarget = sessionStorage.getItem('scrollTarget');
    if (scrollTarget) {
      const scrollToSection = () => {
        const element = document.getElementById(scrollTarget);
        if (!element) {
          requestAnimationFrame(scrollToSection);
          return;
        }
        scroller.scrollTo(scrollTarget, {
          duration: 500,
          smooth: true,
          offset: -(headerHeight || 80), // Use headerHeight with fallback
          isDynamic: true,
        });
        setTimeout(() => {
          window.history.replaceState(null, '', `#${scrollTarget}`);
        }, 550);
        sessionStorage.removeItem('scrollTarget');
      };
      setTimeout(scrollToSection, 300); // Wait for content stabilization
    }
  }, [headerHeight]);

  return (
    <div className="bg-[#f5f5f5] text-gray-800 w-full px-10 pb-10">
      <main className="max-w-7xl mx-auto px-6 pt-16 lg:py-20 lg:pl-20 ">
        <header className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-light mb-4">
            Professional Fire Safety Services
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Comprehensive fire safety solutions for residential and commercial properties. Our
            BAFE-certified technicians deliver fully compliant installations with 24/7 support
            across London and South East England. Get your free quote today.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <a
              href="tel:03338802993"
              className="bg-red-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-600 transition-colors text-center"
            >
              Call Now: 0333 880 2993
            </a>
            <Link
              href="/#contact-section"
              onClick={handleScrollToContact}
              className="bg-transparent border-2 border-red-700 text-red-700 px-6 py-3 rounded-md font-semibold hover:bg-red-600 hover:text-white transition-colors text-center"
            >
              Request Free Quote
            </Link>
          </div>
        </header>

        {/* Life Safety Systems */}
        <section className="mb-12 flex-col">
          <h2 className="text-2xl font-medium mb-4">Life Safety Systems</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-10">
            <div className="lg:col-span-2">
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>Complete fire safety solutions</strong> designed to protect lives and
                property. Our BAFE-certified team delivers fully compliant fire alarm systems,
                emergency lighting, and integrated safety solutions. Every installation includes
                comprehensive testing, staff training, and ongoing maintenance support.{' '}
                <strong>Free site surveys</strong>
                and detailed proposals for all projects.
              </p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                {[
                  'Fire Alarm Design',
                  'Fire Alarm Installation',
                  'Automatic Opening Vents',
                  'Emergency Voice Communication',
                  'Evacuation Alert',
                  'PA/VA',
                  'Emergency Lighting Solutions',
                ].map((item) => (
                  <div key={item} className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-5 w-5 align-middle text-sky-600"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-2xl font-medium mb-4">Security</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 items-start">
            <div className="lg:col-span-2">
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>Advanced security systems</strong> for complete property protection. Our
                expert team designs and installs state-of-the-art intruder alarms, CCTV
                surveillance, access control, and intercom systems. All installations include remote
                monitoring options, mobile app control, and 24/7 technical support.{' '}
                <strong>Same-day emergency call-outs</strong> available across London & South East.
              </p>
              <ul className="grid grid-cols-2 gap-x-2 gap-y-4">
                {['Intruder Alarms', 'CCTV', 'Intercom', 'Access Control', 'Automated Gates'].map(
                  (s) => (
                    <li key={s} className="flex items-center">
                      <svg
                        className="flex-shrink-0 h-5 w-5 align-middle text-sky-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-800">{s}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
