import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مسار - Masar SaaS | بيئة العمل الفائقة باللغة العربية',
  description: 'منصة مسار التشاركية لتدوين الملاحظات وإدارة المشاريع باللغة العربية',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="antialiased bg-[#0b0f19] text-slate-100 selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
