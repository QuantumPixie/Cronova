import './globals.css';
import { Geist } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

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
        <AuthProvider>
          <ErrorBoundary>
            <div role='application' aria-label='CroNova application'>
              {children}
            </div>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
