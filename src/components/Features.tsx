import { MapPin, BarChart3, Lightbulb, Shield, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { CardSlider } from './CardSlider';

const features = [
  {
    icon: MapPin,
    title: 'Location Intelligence',
    description: 'Analyze foot traffic, demographics, and competition with pinpoint accuracy.',
  },
  {
    icon: BarChart3,
    title: 'Demand Analysis',
    description: 'Real-time data on spending patterns, population density, and growth trends.',
  },
  {
    icon: Lightbulb,
    title: 'Smart Business Suggestions',
    description: 'AI-powered recommendations tailored to your business type and budget.',
  },
  {
    icon: Zap,
    title: 'Profit Insights',
    description: 'Get instant profit estimates and ROI projections for any location.',
  },
  {
    icon: Shield,
    title: 'Competitor Analysis',
    description: 'Evaluate market saturation and competition before you invest.',
  },
  {
    icon: TrendingUp,
    title: 'Market Trends',
    description: 'Predict future trends and stay ahead of market shifts.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 md:px-12 lg:px-16 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Everything you need to make data-driven location decisions for your business.
          </p>
        </motion.div>

        <CardSlider>
          {features.map((feature) => (
            <div
              key={feature.title}
              className="liquid-glass border border-white/10 rounded-xl p-8 h-full flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </CardSlider>
      </div>
    </section>
  );
}
