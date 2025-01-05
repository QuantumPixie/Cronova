import './globals.css';
import { Geist } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';

const geist = Geist({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={geist.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
