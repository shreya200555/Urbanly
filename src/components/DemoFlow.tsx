import { useState } from 'react';
import { MapPin, Package, ArrowLeft, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { PremiumDashboard } from './PremiumDashboard';
import { LoginModal } from './LoginModal';
import { analyzeLocation, analyzeProduct, LocationResponse, ProductResponse } from '../services/api';

export type DemoState = 
  | 'selection' 
  | 'location-input' 
  | 'product-input' 
  | 'loading' 
  | 'results'
  | 'premium';

interface DemoFlowProps {
  demoState: DemoState;
  setDemoState: (state: DemoState) => void;
  onClose: () => void;
}

export function DemoFlow({ demoState, setDemoState, onClose }: DemoFlowProps) {
  const [locationInput, setLocationInput] = useState('');
  const [productInput, setProductInput] = useState('');
  const [budget, setBudget] = useState('');
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [results, setResults] = useState<null | (LocationResponse | ProductResponse) & { 
    inputValue: string; 
    flowType: 'location' | 'product';
    error?: string;
  }>(null);
  const [apiStatus, setApiStatus] = useState<{
    gemini_used?: boolean;
    fallback_used?: boolean;
    fallback_reason?: string | null;
  }>({});

  const handleLocationSubmit = async () => {
    if (!locationInput.trim()) return;
    setDemoState('loading');
    setResults(null);
    
    try {
      const data = await analyzeLocation(locationInput);
      setApiStatus({
        gemini_used: data.gemini_used,
        fallback_used: data.fallback_used,
        fallback_reason: data.fallback_reason
      });
      setResults({
        ...data,
        inputValue: locationInput,
        flowType: 'location',
      });
      setDemoState('results');
    } catch (error) {
      console.error('API Error:', error);
      setResults({
        location: locationInput,
        score: 0,
        metrics: {
          foot_traffic: { level: 'Unknown', score: 0 },
          competition: { level: 'Unknown', score: 0 },
          spending_power: { level: 'Unknown', score: 0 },
          population_density: { level: 'Unknown', score: 0 },
        },
        area_type: 'Unknown',
        demand_trend: 'Unknown',
        is_estimated: true,
        recommendations: [],
        error: error instanceof Error ? error.message : 'Failed to analyze location',
        inputValue: locationInput,
        flowType: 'location',
      });
      setDemoState('results');
    }
  };

  const handleProductSubmit = async () => {
    if (!productInput.trim()) return;
    setDemoState('loading');
    setResults(null);
    
    try {
      const data = await analyzeProduct(productInput);
      setApiStatus({
        gemini_used: data.gemini_used,
        fallback_used: data.fallback_used,
        fallback_reason: data.fallback_reason
      });
      setResults({
        ...data,
        inputValue: productInput,
        flowType: 'product',
      });
      setDemoState('results');
    } catch (error) {
      console.error('API Error:', error);
      setResults({
        product: productInput,
        recommendations: [],
        error: error instanceof Error ? error.message : 'Failed to analyze product',
        inputValue: productInput,
        flowType: 'product',
      });
      setDemoState('results');
    }
  };

  const resetDemo = () => {
    setDemoState('selection');
    setLocationInput('');
    setProductInput('');
    setBudget('');
    setResults(null);
    setIsPremiumUnlocked(false);
    setShowLoginModal(false);
  };

  const handleUpgradeClick = () => {
    if (isPremiumUnlocked) {
      setDemoState('premium');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsPremiumUnlocked(true);
    setDemoState('premium');
  };

  // Render content based on demo state
  const renderContent = () => {
    if (demoState === 'selection') return (
      <section id="demo" className="min-h-screen bg-black py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white mb-8 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            What would you like to explore?
          </h2>
          <p className="text-gray-300 text-lg mb-12">
            Choose your starting point and let our AI guide you to the perfect business decision.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Option 1: I have a location */}
            <button
              onClick={() => setDemoState('location-input')}
              className="liquid-glass border border-white/10 rounded-2xl p-8 text-left hover:border-white/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                <MapPin className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                I have a location
              </h3>
              <p className="text-gray-300 mb-4">
                Enter your area or pincode and discover what businesses would thrive there.
              </p>
              <div className="flex items-center text-white font-medium">
                Get Started
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option 2: I have a product */}
            <button
              onClick={() => setDemoState('product-input')}
              className="liquid-glass border border-white/10 rounded-2xl p-8 text-left hover:border-white/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                <Package className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                I have a product
              </h3>
              <p className="text-gray-300 mb-4">
                Tell us what you sell and find the ideal locations to maximize your success.
              </p>
              <div className="flex items-center text-white font-medium">
                Get Started
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>
    );

    if (demoState === 'location-input') return (
      <section className="min-h-screen bg-black py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setDemoState('selection')}
            className="text-gray-300 hover:text-white mb-8 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="mb-8">
            <div className="w-12 h-1 bg-white/30 rounded-full mb-2">
              <div className="w-1/2 h-full bg-white rounded-full"></div>
            </div>
            <span className="text-gray-400 text-sm">Step 1 of 2</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Where is your location?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Enter your area name or pincode to analyze the market potential.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Area / Pincode *
              </label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="e.g., Bandra West, Mumbai or 400050"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Budget Range (Optional)
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
              >
                <option value="" className="bg-black">Select budget range</option>
                <option value="low" className="bg-black">Under ₹5 Lakh</option>
                <option value="medium" className="bg-black">₹5-15 Lakh</option>
                <option value="high" className="bg-black">₹15-50 Lakh</option>
                <option value="enterprise" className="bg-black">Above ₹50 Lakh</option>
              </select>
            </div>

            <button
              onClick={handleLocationSubmit}
              disabled={!locationInput.trim()}
              className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze Location
            </button>
          </div>
        </div>
      </section>
    );

    if (demoState === 'product-input') return (
      <section className="min-h-screen bg-black py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setDemoState('selection')}
            className="text-gray-300 hover:text-white mb-8 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="mb-8">
            <div className="w-12 h-1 bg-white/30 rounded-full mb-2">
              <div className="w-1/2 h-full bg-white rounded-full"></div>
            </div>
            <span className="text-gray-400 text-sm">Step 1 of 2</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            What is your product?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Describe your product or service to find the best locations for it.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Product Type *
              </label>
              <input
                type="text"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder="e.g., Specialty Coffee, Handmade Jewelry, Tech Gadgets"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Budget Range (Optional)
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
              >
                <option value="" className="bg-black">Select budget range</option>
                <option value="low" className="bg-black">Under ₹5 Lakh</option>
                <option value="medium" className="bg-black">₹5-15 Lakh</option>
                <option value="high" className="bg-black">₹15-50 Lakh</option>
                <option value="enterprise" className="bg-black">Above ₹50 Lakh</option>
              </select>
            </div>

            <button
              onClick={handleProductSubmit}
              disabled={!productInput.trim()}
              className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Find Best Locations
            </button>
          </div>
        </div>
      </section>
    );

    if (demoState === 'loading') return (
      <section className="min-h-screen bg-black py-20 px-6 md:px-12 lg:px-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-2">
            Analyzing your input...
          </h3>
          <p className="text-gray-300">
            Our AI is crunching market data, foot traffic patterns, and competition metrics.
          </p>
        </div>
      </section>
    );

    if (demoState === 'results' && results) {
      const isLocationFlow = results.flowType === 'location';
      const locationResult = isLocationFlow ? results as LocationResponse & { inputValue: string; flowType: 'location' | 'product'; error?: string } : null;
      const productResult = !isLocationFlow ? results as ProductResponse & { inputValue: string; flowType: 'location' | 'product'; error?: string } : null;
      
      const displayScore = locationResult?.score || 0;
      const displayMetrics = locationResult?.metrics;
      const recommendations = locationResult?.recommendations || productResult?.recommendations || [];
      
      return (
        <section className="min-h-screen bg-black py-20 px-6 md:px-12 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={resetDemo}
              className="text-gray-300 hover:text-white mb-8 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              Start New Analysis
            </button>

            {/* Error Display */}
            {results.error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                <AlertCircle className="text-red-400" size={24} />
                <div>
                  <p className="text-red-400 font-semibold">Analysis Error</p>
                  <p className="text-gray-300 text-sm">{results.error}</p>
                </div>
              </div>
            )}

            {/* Debug Badge */}
            <div className="flex justify-center gap-3 mb-8">
              {apiStatus.gemini_used && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full">
                  <Sparkles className="text-purple-400" size={16} />
                  <span className="text-purple-300 text-sm font-medium">AI Powered</span>
                </div>
              )}
              {apiStatus.fallback_used && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                  <AlertCircle className="text-yellow-400" size={16} />
                  <span className="text-yellow-300 text-sm font-medium">Estimated Results</span>
                </div>
              )}
            </div>

            {/* Location Score - Only for Location Flow */}
            {isLocationFlow && displayScore > 0 && (
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full liquid-glass border-2 border-white/30 mb-4">
                  <span className="text-5xl font-bold text-white">{displayScore}</span>
                </div>
                <p className="text-gray-300 text-lg">Location Score</p>
              </div>
            )}

            {/* Metrics Row - Only for Location Flow */}
            {isLocationFlow && displayMetrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="liquid-glass border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Foot Traffic</p>
                  <p className="text-white font-semibold">{displayMetrics.foot_traffic.level}</p>
                  <p className="text-gray-500 text-sm">({displayMetrics.foot_traffic.score}/100)</p>
                </div>
                <div className="liquid-glass border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Competition</p>
                  <p className="text-white font-semibold">{displayMetrics.competition.level}</p>
                  <p className="text-gray-500 text-sm">({displayMetrics.competition.score}/100)</p>
                </div>
                <div className="liquid-glass border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Spending Power</p>
                  <p className="text-white font-semibold">{displayMetrics.spending_power.level}</p>
                  <p className="text-gray-500 text-sm">({displayMetrics.spending_power.score}/100)</p>
                </div>
                <div className="liquid-glass border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Population Density</p>
                  <p className="text-white font-semibold">{displayMetrics.population_density.level}</p>
                  <p className="text-gray-500 text-sm">({displayMetrics.population_density.score}/100)</p>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <h3 className="text-2xl font-semibold text-white mb-6">
              Top Recommendations
            </h3>
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {recommendations.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-400">No recommendations available. Please try again.</p>
                </div>
              ) : (
                recommendations.map((rec: any, index: number) => (
                  <div
                    key={index}
                    className="liquid-glass border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-white font-semibold">{index + 1}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {'name' in rec ? rec.name : rec.area}
                    </h4>
                    <p className="text-gray-300 text-sm">{'reasoning' in rec ? rec.reasoning : rec.explanation || rec.reasoning}</p>
                    {rec.tag && (
                      <span className="inline-block mt-3 px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                        {rec.tag}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Premium Section */}
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="liquid-glass border border-white/10 rounded-xl p-6 blur-sm">
                  <h4 className="text-lg font-semibold text-white mb-2">Profit Estimates</h4>
                  <p className="text-gray-300 text-sm">Detailed monthly revenue projections based on market analysis.</p>
                </div>
                <div className="liquid-glass border border-white/10 rounded-xl p-6 blur-sm">
                  <h4 className="text-lg font-semibold text-white mb-2">Competitor Insights</h4>
                  <p className="text-gray-300 text-sm">Deep dive into nearby competitors and market saturation.</p>
                </div>
              </div>

              {/* Unlock CTA */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="liquid-glass border border-white/20 rounded-2xl p-8 text-center">
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {isPremiumUnlocked ? 'Premium Unlocked' : 'Unlock Full Report'}
                  </h4>
                  <p className="text-gray-300 mb-4 max-w-sm">
                    {isPremiumUnlocked 
                      ? 'Your premium report is ready. View detailed insights now.'
                      : 'Get detailed profit estimates, competitor analysis, and personalized recommendations.'}
                  </p>
                  <button 
                    onClick={handleUpgradeClick}
                    className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    {isPremiumUnlocked ? 'View Full Report' : 'Upgrade Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (demoState === 'premium' && results) {
      const isLocationFlow = results.flowType === 'location';
      const locationResult = isLocationFlow ? results as LocationResponse & { inputValue: string; flowType: 'location' | 'product'; error?: string } : null;
      const productResult = !isLocationFlow ? results as ProductResponse & { inputValue: string; flowType: 'location' | 'product'; error?: string } : null;
      
      const recommendations = locationResult?.recommendations || productResult?.recommendations || [];
      
      const displayScore = locationResult?.score || 0;
      const displayMetrics = locationResult?.metrics;

      // Convert metrics format for PremiumDashboard
      const dashboardMetrics = displayMetrics ? {
        footTraffic: displayMetrics.foot_traffic,
        competition: displayMetrics.competition,
        spendingPower: displayMetrics.spending_power,
        populationDensity: displayMetrics.population_density
      } : undefined;

      // Get premium insights
      const premiumInsights = locationResult?.premium_insights || productResult?.premium_insights;
      const marketInsight = locationResult?.market_insight;
      const strategicRecommendation = productResult?.strategic_recommendation;

      return (
        <PremiumDashboard
          score={displayScore}
          inputValue={results.inputValue}
          flowType={results.flowType}
          metrics={dashboardMetrics}
          recommendations={recommendations}
          premiumInsights={premiumInsights}
          marketInsight={marketInsight}
          strategicRecommendation={strategicRecommendation}
          onBack={() => setDemoState('results')}
        />
      );
    }

  return null;
};

  return (
    <>
      {renderContent()}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
      />
    </>
  );
}
