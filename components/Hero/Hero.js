'use client';

import React from 'react';
import { Element, scroller } from 'react-scroll';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { useHeaderHeight } from './useHeaderHeight';
import SmokeCanvas from './SmokeCanvas';

const Hero = () => {
  const router = useRouter();
  const pathname = usePathname();
  const headerHeight = useHeaderHeight();

  const dynamicHeight = headerHeight > 0 ? `calc(100vh - ${headerHeight}px)` : '100vh';

  const handleScrollToContact = (e) => {
    e.preventDefault();
    const sectionId = 'contact-section';
    scroller.scrollTo(sectionId, {
      duration: 500,
      smooth: true,
      offset: -headerHeight,
      isDynamic: true,
    });
    if (window.location.hash !== `#${sectionId}`) {
      router.replace(`/${pathname}#${sectionId}`);
    }
  };

  return (
    <Element name="home">
      <section className="section-1 relative">
        <SmokeCanvas dynamicHeight={dynamicHeight} />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[70rem] mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="relative flex flex-col items-start transform -translate-y-8 sm:-translate-y-12 ml-2 sm:ml-4 lg:ml-8">
              <h1 className="primary-title font-roboto text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-white mb-2 sm:mb-3 inline-block bg-[rgba(25,25,25,0.5)] p-3 sm:p-4 lg:p-6 rounded-sm sm:rounded-md">
                Professional Fire Alarm Installation & Maintenance Services
              </h1>
              <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-4 sm:mb-6 bg-[rgba(25,25,25,0.5)] p-3 sm:p-4 lg:p-6 rounded-sm sm:rounded-md">
                BAFE-certified technicians ✓ 24/7 monitoring ✓ Fast response times
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/#contact-section"
                  onClick={handleScrollToContact}
                  className="get-quote font-roboto text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white bg-[#e53935] px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-sm sm:rounded-md inline-block cursor-pointer no-underline transition-colors duration-300 hover:bg-[#c62828] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                  aria-label="Request a free fire safety quote"
                >
                  Request Free Quote
                </Link>
                <a
                  href="tel:03338802993"
                  className="font-roboto text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white bg-transparent border-2 border-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-sm sm:rounded-md inline-block cursor-pointer no-underline transition-colors duration-300 hover:bg-white hover:text-[#e53935] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                  aria-label="Call WP Fire now at 0333 880 2993"
                >
                  Call Now: 0333 880 2993
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Element>
  );
};

export default Hero;
