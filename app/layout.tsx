// app/layout.tsx   ← still .tsx because it contains JSX
import './globals.css';
import { Roboto } from 'next/font/google';
import Header from '../components/main-header/Header';
import Footer from '../components/Footer';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata = {
  title: 'WP Fire - Fire Alarm Installation Services',
  description: 'Your trusted partner for professional fire alarm installation services.',
  verification: {
    google: 'jQRlBNLFGxNM4gWnV4o2XIsrbTJGpva8KJC3owSzHOc',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-roboto overflow-x-hidden m-0 p-0 flex 
        justify-center items-stretch flex-col min-h-screen bg-white`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
