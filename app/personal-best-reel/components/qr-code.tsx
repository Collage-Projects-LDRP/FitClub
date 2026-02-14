import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/logo';
import Image from "next/image";

// Product images mapping using actual product images from the database
const PRODUCT_IMAGES = {
  '1': 'https://mlhwdgnjopma.i.optimole.com/w:auto/h:auto/q:mauto/process:14163/id:aa74f05c74fd5742afa77fdff8bc3859/https://techforbs.com/1-removebg-preview.png', // Protein Powder
  '2': 'https://mlhwdgnjopma.i.optimole.com/w:auto/h:auto/q:mauto/process:14169/id:6e8ee1c0d0b01eb749e28a3bb02cb643/https://techforbs.com/5-6.png', // BCAA
  '3': 'https://mlhwdgnjopma.i.optimole.com/w:auto/h:auto/q:mauto/process:14166/id:b9882e6bb57237d68f0bda46d8abd7cd/https://techforbs.com/2-8.png', // Protein Powder
  '4': 'https://mlhwdgnjopma.i.optimole.com/w:auto/h:auto/q:mauto/process:14168/id:ab6eff67544c912b5d3cc9d6c3b9a63c/https://techforbs.com/4-7.pn'  // Creatine
} as const;

interface QRCodeProps {
  qrCodePath: string;
  title: string;
  subtitle: string;
  outroId?: string;
  className?: string;
}

export function QRCode({
  qrCodePath,
  title,
  subtitle,
  outroId = '1',
  className = ''
}: QRCodeProps) {
  // Get the product image based on outroId or use default
  const productImage = PRODUCT_IMAGES[outroId as keyof typeof PRODUCT_IMAGES] || PRODUCT_IMAGES['1'];
  const isPremium = outroId === '5';
  const isExclusive = outroId === '6';

  if (isExclusive) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br "
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.8 }
          }}
        >
          {/* Animated Floating Elements */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: Math.random() * 15 + 5,
                height: Math.random() * 15 + 5,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: '0 0 20px rgba(255,255,255,0.2)'
              }}
              animate={{
                y: [0, -100],
                x: [0, (Math.random() - 0.5) * 60],
                opacity: [0.1, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                repeatType: 'loop',
                delay: Math.random() * 5,
                ease: 'linear',
              }}
            />
          ))}
        </motion.div>

        {/* Main Content Container */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
          {/* Glass Morphism Card */}
          <motion.div
            className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.2,
                type: 'spring',
                stiffness: 100,
                damping: 15
              }
            }}
          >
            {/* Header with Logo */}
            <motion.div
              className="p-6 pb-0"
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: {
                  delay: 0.4,
                  duration: 0.5
                }
              }}
            >
              <div className="relative w-64 h-32 mx-auto mb-2 left-1/2 transform -translate-x-1/2">
                <Image
                  src="/allmax.png"
                  alt="Allmax"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-4" />
            </motion.div>

            {/* Product Image */}
            <motion.div
              className="relative w-48 h-48 mx-auto -mt-8 mb-2"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.6,
                  type: 'spring',
                  stiffness: 100,
                  damping: 12
                }
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <Image
                src={productImage}
                alt="Product"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 12rem, 24rem"
                priority
              />
              <div className="p-6 pt-0 text-center">

                {/* QR Code */}
                <motion.div
                  className="p-2.5 rounded-xl shadow-lg inline-block absolute bottom-1 right-3 z-20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      delay: 1,
                      type: 'spring',
                      stiffness: 200,
                      damping: 15
                    }
                  }}
                  whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Image
                    src="/1qr-code.png"
                    alt="QR Code"
                    width={50}
                    height={50}
                    className="rounded-lg"
                    priority
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Content */}


            {/* Footer */}
            <motion.div
              className="bg-black/20 p-3 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: {
                  delay: 1.2,
                  duration: 0.4
                }
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-white/70">POWERED BY</span>
                <Logo size="sm" isClickable={false} showUnderline={false} textClassName="text-[10px]" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isPremium) {
    return (
      <div className="relative w-full h-full">
        {/* Website Logo at Top - Outside Container */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-30 flex items-center justify-center">
          <Logo size="sm" isClickable={false} showUnderline={false} />
        </div>

        <motion.div
          className={`relative w-full h-full overflow-hidden ${className}`}
          initial="initial"
          animate="animate"
        >
          {/* Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br"
            variants={{
              initial: { opacity: 0 },
              animate: {
                opacity: 1,
                transition: { duration: 0.8, ease: 'easeOut' }
              }
            }}
          >
            <Image
              src="/outro.png"
              alt="Background"
              fill
              className="object-cover opacity-20"
              priority
            />
          </motion.div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            <div className="flex flex-row items-center justify-center gap-10 w-full mr-10">
              {/* Allmax Logo */}
              <motion.div
                className="w-40 h-20 relative"
                variants={{
                  initial: { y: -50, opacity: 0 },
                  animate: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      delay: 0.2,
                      type: 'spring',
                      stiffness: 100,
                      damping: 12
                    }
                  }
                }}
              >
                <Image
                  src="/allmax.png"
                  alt="Allmax"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
              {/* QR Code */}
              <motion.div
                className="bg-white  rounded-lg shadow-xl"
                variants={{
                  initial: { scale: 0.9, opacity: 0 },
                  animate: {
                    scale: 1,
                    opacity: 1,
                    transition: {
                      delay: 0.8,
                      type: 'spring',
                      stiffness: 200,
                      damping: 15
                    }
                  }
                }}
              >
                <Image
                  src="/1qr-code.png"
                  alt="QR Code"
                  width={60}
                  height={60}
                  className="rounded"
                  priority
                />
              </motion.div>
            </div>
            {/* Product Image */}
            <motion.div
              className="relative w-48 h-48 md:w-64 md:h-64"
              variants={{
                initial: { scale: 0.8, opacity: 0 },
                animate: {
                  scale: 1,
                  opacity: 1,
                  transition: {
                    delay: 0.4,
                    type: 'spring',
                    stiffness: 100,
                    damping: 10
                  }
                }
              }}
            >
              <Image
                src={productImage}
                alt="Product"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 12rem, 16rem"
                priority
              />
            </motion.div>

            {/* Title and Subtitle */}
            <motion.div
              className="text-center mb-2"
              variants={{
                initial: { y: 20, opacity: 0 },
                animate: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    delay: 0.6,
                    duration: 0.5
                  }
                }
              }}
            >
              <h3 className="text-2xl font-extrabold text-white mb-2 tracking-wide">{title}</h3>
              <p className="text-lg text-amber-100 font-medium">{subtitle}</p>
            </motion.div>


          </div>
        </motion.div>
      </div>
    );
  }

  // Default QR Code Layout
  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src="/allmax.png"
        alt="QR Code"
        width={120}
        height={120}
        className="rounded"
        priority
      />
      <div className="text-center mb-2 text-white flex flex-row items-center justify-center gap-2 w-full">powered by
        <Logo size="sm" isClickable={false} showUnderline={false} />
      </div>
      <div className="flex flex-row items-center justify-center gap-6 w-full">
        {/* QR Code */}
        <div className="p-3 bg-white rounded-lg">
          <Image
            src="/qr-code.png"
            alt="QR Code"
            width={120}
            height={120}
            className="rounded"
            priority
          />
        </div>

        {/* Product Image */}
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <Image
            src={productImage}
            alt="Product"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 6rem, 8rem"
            priority
          />
        </div>
      </div>

      {/* Title and Subtitle */}
      <div className="mt-6 text-center">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-300">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export const QRCodePreview = ({
  qrCodePath,
  title,
  subtitle,
  outroId = '1',
  className = ''
}: QRCodeProps) => {
  // For preview, we want to show a simplified version of the QR code
  if (outroId === '5' || outroId === '6') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-16 h-16">
          <Image
            src={outroId === '6' ? '/1qr-code.png' : '/qr-code.png'}
            alt="QR Code"
            fill
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="bg-white/90 p-1.5 rounded-lg shadow-md">
        <div className="relative w-12 h-12">
          <Image
            src={qrCodePath || '/qr-code.png'}
            alt="QR Code"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};
