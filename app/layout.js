import './globals.css';
import Header from '../components/main-header/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'WP Fire - Fire Alarm Installation Services',
  description: 'Your trusted partner for professional fire alarm installation services.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="overflow-x-hidden font-roboto m-0 p-0 flex 
      justify-center items-stretch flex-col min-h-screen bg-white"
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
