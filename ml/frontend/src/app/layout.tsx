import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Kavach-ML Model - Parametric Protection',
  description: 'AI-powered Parametric Income Auto-Payout system for Gig Workers',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="app-root">
          {children}
        </div>
      </body>
    </html>
  );
}
