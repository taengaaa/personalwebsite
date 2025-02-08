import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const geist = localFont({
  src: [
    {
      path: '../public/otf/Geist-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/otf/Geist-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/otf/Geist-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/otf/Geist-Bold.otf',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Simon Affentranger",
  description: "Personal Website of Simon Affentranger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
