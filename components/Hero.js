'use client';

import React, { useEffect, useState } from 'react';
import { Element, scroller } from 'react-scroll';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

// Simple throttler for resize events
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return (...args) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        },
        Math.max(0, limit - (Date.now() - lastRan))
      );
    }
  };
};

const HeroSlider = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [headerHeight, setHeaderHeight] = useState(0);

  // Dynamically measure header height on mount and resize
  useEffect(() => {
    const updateHeaderHeight = throttle(() => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.clientHeight);
      }
    }, 200);

    requestAnimationFrame(updateHeaderHeight); // Measure after initial render
    window.addEventListener('resize', updateHeaderHeight);

    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  const handleScrollToContact = (e) => {
    e.preventDefault();
    const sectionId = 'contact-section';
    if (window.location.hash === `#${sectionId}`) {
      // If already at section, recalculate and scroll again if needed
      scroller.scrollTo(sectionId, {
        duration: 500,
        smooth: true,
        offset: -headerHeight,
        isDynamic: true,
      });
    } else {
      scroller.scrollTo(sectionId, {
        duration: 500,
        smooth: true,
        offset: -headerHeight,
        isDynamic: true,
      });
      router.replace(`/${pathname}#${sectionId}`);
    }
  };

  // Dynamic height style for the hero
  const dynamicHeight = headerHeight > 0 ? `calc(100vh - ${headerHeight}px)` : '100vh';

  return (
    <Element name="home">
      <section className="section-1 relative">
        <div className="slideshow-container relative mx-auto" style={{ height: dynamicHeight }}>
          <div className="mySlides animate-fade">
            <div className="relative w-screen" style={{ height: dynamicHeight }}>
              <Image
                src="/images/fire-alarm-landing-1.jpg"
                alt="Professional fire alarm installation in modern office building"
                fill
                priority
                className="object-cover object-[center_40%]"
                sizes="100vw"
              />
            </div>
          </div>
        </div>

        {/* Text Container with Max Width */}
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

export default HeroSlider;
