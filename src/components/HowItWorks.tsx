import { Search, LineChart, Rocket, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';
import { CardSlider } from './CardSlider';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Enter Your Data',
    description: 'Input your location or product details. Add budget constraints if needed.',
  },
  {
    icon: LineChart,
    number: '02',
    title: 'AI Analyzes',
    description: 'Our AI processes demand patterns, competition levels, and market trends.',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Get Recommendations',
    description: 'Receive personalized business ideas or optimal locations with detailed scores.',
  },
  {
    icon: Unlock,
    number: '04',
    title: 'Unlock Full Insights',
    description: 'Access premium analytics including profit estimates and competitor insights.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-12 lg:px-16 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Four simple steps to smarter business decisions.
          </p>
        </motion.div>

        <CardSlider>
          {steps.map((step) => (
            <div
              key={step.number}
              className="liquid-glass border border-white/10 rounded-xl p-8 h-full flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                  <step.icon className="text-white" size={32} />
                </div>
                <span className="absolute -top-2 -right-2 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center text-sm font-semibold">
                  {step.number}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
            </div>
          ))}
        </CardSlider>
      </div>
    </section>
  );
}
