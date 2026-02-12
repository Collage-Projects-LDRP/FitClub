import { PhotoCreationProvider } from '@/contexts/PhotoCreationContext';

export default function PhotoCreationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PhotoCreationProvider>
      {children}
    </PhotoCreationProvider>
  );
}
