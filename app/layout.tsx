import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TimeFlow - Learning Time Tracker',
  description: 'Track your SIEM Security Learning Roadmap progress',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
