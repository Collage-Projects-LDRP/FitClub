import Image from 'next/image';
import { motion } from 'framer-motion';

interface QRCodeProps {
  qrCodePath: string;
  title: string;
  subtitle: string;
  className?: string;
}

export function QRCode({ qrCodePath, title, subtitle, className = '' }: QRCodeProps) {
  return (
    <motion.div 
      className={`flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 bg-white rounded-lg mb-4 shadow-lg">
        <Image
          src={qrCodePath}
          alt="QR Code"
          width={160}
          height={160}
          className="w-40 h-40 object-contain"
          priority
        />
      </div>
      <h3 className="text-xl font-bold text-white mb-1 text-center">{title}</h3>
      <p className="text-white/80 text-sm text-center max-w-xs">{subtitle}</p>
    </motion.div>
  );
}

export function QRCodePreview({ qrCodePath, className = '' }: { qrCodePath: string; className?: string }) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center p-4 ${className}`}>
      <div className="p-3 bg-white rounded-lg shadow-xl">
        <Image
          src={qrCodePath}
          alt="QR Code"
          width={120}
          height={120}
          className="w-30 h-30 object-contain"
          priority
        />
      </div>
    </div>
  );
}
