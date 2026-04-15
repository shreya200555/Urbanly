import { motion } from 'framer-motion';
import { FadeIn } from './FadeIn';

interface HeroProps {
  onDemoClick: () => void;
}

export function Hero({ onDemoClick }: HeroProps) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-6 md:px-12 lg:px-16 pt-32 pb-12 lg:pb-16">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Main Headline */}
          <motion.h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-8 leading-tight">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              RIGHT PRODUCT. RIGHT PLACE.
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
            >
              WE MAKE SURE OF BOTH.
            </motion.span>
          </motion.h1>

          {/* CTA Button */}
          <FadeIn delay={800} duration={800}>
            <button
              onClick={onDemoClick}
              className="bg-white text-black px-8 py-3 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Try Live Demo
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}