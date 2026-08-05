'use client';

import {
  IoPencilOutline,
  IoHammerOutline,
  IoCheckmarkCircleOutline,
  IoHeadsetOutline,
  IoRocketOutline,
  IoShieldOutline,
} from 'react-icons/io5';

import type { IconType } from 'react-icons';

const ICON_MAP: Record<string, IconType> = {
  'pencil-outline': IoPencilOutline,
  'hammer-outline': IoHammerOutline,
  'checkmark-circle-outline': IoCheckmarkCircleOutline,
  'headset-outline': IoHeadsetOutline,
  'rocket-outline': IoRocketOutline,
  'shield-outline': IoShieldOutline,
};

export default function Features() {
  const items = [
    {
      icon: 'pencil-outline',
      title: 'Expert Design',
      content:
        "BAFE-certified designers create compliant fire alarm systems tailored to your building's specific requirements. Free site surveys and detailed proposals included.",
    },
    {
      icon: 'hammer-outline',
      title: 'Professional Installation',
      content:
        'NICET-trained technicians install systems using premium equipment. All work guaranteed with full compliance certificates and insurance coverage.',
    },
    {
      icon: 'checkmark-circle-outline',
      title: 'Thorough Commissioning',
      content:
        'Complete system testing and commissioning with local authority sign-off. Includes staff training and emergency procedure documentation.',
    },
    {
      icon: 'headset-outline',
      title: '24/7 Support',
      content:
        'Round-the-clock monitoring and emergency call-out service. Average response time under 2 hours for critical issues across London & South East.',
    },
    {
      icon: 'rocket-outline',
      title: 'Fast Delivery',
      content:
        'Projects completed on schedule with minimal disruption. Same-day emergency installations available for urgent requirements.',
    },
    {
      icon: 'shield-outline',
      title: 'Ongoing Maintenance',
      content:
        'Comprehensive maintenance contracts ensure optimal system performance. Regular inspections, testing, and compliance reporting included.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="max-w-[70rem] min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 justify-center items-center px-4 sm:px-6 lg:px-8">
        {items.map((i) => {
          const Icon = ICON_MAP[i.icon] || IoPencilOutline;
          return (
            <div key={i.title} className="flex flex-col items-center text-center p-4 sm:p-6">
              <div className="mb-3 sm:mb-4 rounded-full border-2 border-[#e53935] bg-[#555] p-3 sm:p-4">
                <Icon className="text-white" size={40} />
              </div>

              <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 font-extrabold mb-2 sm:mb-3">
                {i.title}
              </p>
              <p className="text-sm sm:text-base font-light leading-relaxed text-center max-w-xs">
                {i.content}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
