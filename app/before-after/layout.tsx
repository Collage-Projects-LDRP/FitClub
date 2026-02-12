import { BeforeAfterProvider } from '@/contexts/BeforeAfterContext';

export default function BeforeAfterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BeforeAfterProvider>
      {children}
    </BeforeAfterProvider>
  );
}
