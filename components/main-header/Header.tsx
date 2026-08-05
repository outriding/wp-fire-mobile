'use client';

import NextLink from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IoCallOutline } from 'react-icons/io5';
import { scroller } from 'react-scroll';
import { throttle } from '@/lib/throttle';
import { useScrollSpy } from '@/hooks/useScrollSpy';

const SECTION_IDS = ['home', 'about-section', 'contact-section'] as const;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);
  const lastTopRef = useRef(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Update header height on mount and resize for dynamic offset
  useEffect(() => {
    const updateHeaderHeight = throttle(() => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.clientHeight);
      }
    }, 200);

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  const currentActive = useScrollSpy(SECTION_IDS, headerHeight);

  // mobile menu state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMaxHeight, setMobileMaxHeight] = useState(0);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // compute dynamic max-height for smooth height animation
  useEffect(() => {
    const compute = () => {
      if (mobileContentRef.current) {
        const measured = mobileContentRef.current.scrollHeight;
        setMobileMaxHeight(measured + 24);
      }
    };

    compute();
    window.addEventListener('resize', compute);

    const observer = new MutationObserver(() => compute());
    if (mobileContentRef.current) {
      observer.observe(mobileContentRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      window.removeEventListener('resize', compute);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => {
        if (mobileContentRef.current) {
          setMobileMaxHeight(mobileContentRef.current.scrollHeight + 24);
        }
      });
    }
  }, [mobileOpen]);

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    const sectionId = hash.slice(1);

    if (pathname === '/') {
      scroller.scrollTo(sectionId, {
        duration: 500,
        smooth: true,
        offset: -headerHeight,
      });
      router.replace(hash);

      setMobileOpen(false);
    } else {
      sessionStorage.setItem('scrollTarget', sectionId);
      router.push('/');
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    if (pathname === '/') {
      const scrollTarget = sessionStorage.getItem('scrollTarget');

      if (scrollTarget) {
        lastTopRef.current = 0;
        const scrollToSection = () => {
          const element = document.getElementById(scrollTarget);
          if (!element || !headerRef.current) {
            requestAnimationFrame(scrollToSection);
            return;
          }

          const currentTop = element.offsetTop;
          if (currentTop === lastTopRef.current) {
            const freshHeaderHeight = headerRef.current.clientHeight;
            scroller.scrollTo(scrollTarget, {
              duration: 500,
              smooth: true,
              offset: -freshHeaderHeight,
            });
            setTimeout(() => {
              window.history.replaceState(null, '', `#${scrollTarget}`);
            }, 550);
          } else {
            lastTopRef.current = currentTop;
            requestAnimationFrame(scrollToSection);
          }
        };

        setTimeout(scrollToSection, 300);
        sessionStorage.removeItem('scrollTarget');
      }
    }
  }, [pathname]);

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileOpen &&
        headerRef.current &&
        mobileContentRef.current &&
        !headerRef.current.contains(event.target as Node) &&
        !mobileContentRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileOpen]);

  const baseLinkClass =
    'inline-block no-underline font-normal text-base hover:text-[#cf711f] active:text-[#b24f00] focus:outline-none focus:ring-0 transition-colors duration-200';

  const getLinkClass = (section: string) => {
    if (pathname !== '/') {
      return `${baseLinkClass} text-[#333]`;
    }
    return `${baseLinkClass} ${currentActive === section ? 'text-[#cf711f]' : 'text-[#333]'}`;
  };

  const forceRepaint = () => {
    void document.body.offsetHeight;
    requestAnimationFrame(() => {});
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="w-full max-w-[70rem] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 lg:h-24 flex items-center justify-between">
        <NextLink
          href="/"
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              router.replace('/');
              setMobileOpen(false);
            }
          }}
          className="block"
        >
          <Image
            src="/images/wp-fire-logo-removebg.png"
            alt="WP Fire logo"
            width={0}
            height={0}
            sizes="(max-width: 640px) 10vw, (max-width: 1024px) 5vw, 5vw"
            className="h-12 sm:h-full w-auto object-contain"
            priority
          />
        </NextLink>

        <nav className="hidden md:flex items-center flex-grow justify-end pr-4 lg:pr-8">
          <ul className="list-none flex items-center gap-6 lg:gap-8 xl:gap-12">
            <li>
              <NextLink
                href="/"
                className={getLinkClass('home')}
                onClick={(e) => {
                  if (pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    router.replace('/');
                  }
                }}
              >
                Home
              </NextLink>
            </li>
            <li>
              <NextLink
                href="/services"
                className={`${baseLinkClass} ${
                  pathname === '/services' ? 'text-[#cf711f]' : 'text-[#333]'
                }`}
              >
                Services
              </NextLink>
            </li>
            <li>
              <NextLink
                href="/#about-section"
                className={getLinkClass('about-section')}
                onClick={(e) => handleHashClick(e, '#about-section')}
              >
                About
              </NextLink>
            </li>
            <li>
              <NextLink
                href="/#contact-section"
                className={getLinkClass('contact-section')}
                onClick={(e) => handleHashClick(e, '#contact-section')}
              >
                Contact
              </NextLink>
            </li>
          </ul>
        </nav>

        <div className="hidden sm:flex gap-3 lg:gap-4 items-center justify-center">
          <div className="border-l border-gray-300 h-4 mr-2" />
          <IoCallOutline size={28} className="text-red-700 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          <div className="flex flex-col">
            <span className="text-xs lg:text-sm font-medium text-[#555]">CALL US NOW</span>
            <h2 className="text-base lg:text-lg xl:text-xl font-bold">0333 880 2993</h2>
          </div>
        </div>

        {/* Mobile menu button with animation */}
        <button
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 space-y-1.5 relative"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((s) => !s)}
        >
          <span
            className={`w-7 h-0.5 bg-gray-700 rounded transition-all duration-300 ease-in-out ${
              mobileOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          ></span>
          <span
            className={`w-7 h-0.5 bg-gray-700 rounded transition-all duration-300 ease-in-out ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          ></span>
          <span
            className={`w-7 h-0.5 bg-gray-700 rounded transition-all duration-300 ease-in-out ${
              mobileOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile nav — enhanced with opacity for smoother animation */}
      <nav
        className={`md:hidden absolute left-0 right-0 top-full bg-white shadow-lg z-40 transition-all duration-300 ease-in-out overflow-hidden`}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        style={{
          maxHeight: mobileOpen ? `${mobileMaxHeight}px` : '0px',
          opacity: mobileOpen ? 1 : 0,
          paddingTop: mobileOpen ? '1.5rem' : '0',
          paddingBottom: mobileOpen ? '1.5rem' : '0',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
      >
        <div className="max-w-[70rem] mx-auto px-6" ref={mobileContentRef}>
          <ul className="flex flex-col gap-6">
            <li>
              <NextLink
                href="/"
                className={`${baseLinkClass} text-[#333] block py-3 hover:bg-gray-50 rounded-md px-2 transition-all`}
                onClick={(e) => {
                  if (pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    router.replace('/');
                  }
                  setMobileOpen(false);
                  forceRepaint();
                }}
              >
                Home
              </NextLink>
            </li>
            <li>
              <NextLink
                href="/services"
                className={`${baseLinkClass} text-[#333] block py-3 hover:bg-gray-50 rounded-md px-2 transition-all`}
                onClick={() => setMobileOpen(false)}
              >
                Services
              </NextLink>
            </li>
            <li>
              <NextLink
                href="/#about-section"
                className={`${baseLinkClass} text-[#333] block py-3 hover:bg-gray-50 rounded-md px-2 transition-all`}
                onClick={(e) => handleHashClick(e, '#about-section')}
              >
                About
              </NextLink>
            </li>
            <li>
              <NextLink
                href="/#contact-section"
                className={`${baseLinkClass} text-[#333] block py-3 hover:bg-gray-50 rounded-md px-2 transition-all`}
                onClick={(e) => handleHashClick(e, '#contact-section')}
              >
                Contact
              </NextLink>
            </li>
          </ul>
          {/* Added call section for mobile */}
          <div className="mt-6 py-4 border-t border-gray-200 flex items-center justify-center gap-3">
            <IoCallOutline size={24} className="text-red-700" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#555]">CALL US NOW</span>
              <h2 className="text-lg font-bold">0333 880 2993</h2>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
