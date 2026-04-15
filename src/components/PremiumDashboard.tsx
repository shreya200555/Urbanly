import { motion } from 'framer-motion';
import { Users, TrendingUp, Clock, MapPin, DollarSign, Target, Building2, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import type { Recommendation, PremiumInsights } from '../services/api';

interface Metric {
  footTraffic: { level: string; score: number };
  competition: { level: string; score: number };
  spendingPower: { level: string; score: number };
  populationDensity: { level: string; score: number };
}

interface PremiumDashboardProps {
  score?: number;
  inputValue: string;
  flowType: 'location' | 'product';
  metrics?: Metric;
  recommendations: Recommendation[];
  premiumInsights?: PremiumInsights;
  marketInsight?: string;
  strategicRecommendation?: string;
  onBack: () => void;
}

export function PremiumDashboard({ score, inputValue, flowType, metrics, recommendations, premiumInsights, marketInsight, strategicRecommendation, onBack }: PremiumDashboardProps) {
  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'High';
    if (s >= 50) return 'Medium';
    return 'Low';
  };

  const getRiskColor = (risk: string) => {
    if (risk.toLowerCase() === 'low') return 'text-green-400';
    if (risk.toLowerCase() === 'medium') return 'text-yellow-400';
    return 'text-red-400';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
  };

  // Get primary recommendation for financial summary
  const primaryRec = recommendations[0];
  const primaryFinancial = primaryRec?.financial_projection;

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-black py-16 px-6 md:px-12 lg:px-16"
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          variants={itemVariants}
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-10 flex items-center gap-2 transition-colors text-sm"
        >
          ← Back to Results
        </motion.button>

        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
            {flowType === 'location' ? 'Location Analysis' : 'Product Analysis'}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            {inputValue}
            {flowType === 'location' && <span className="text-gray-500">, Bangalore</span>}
          </h1>
          {score !== undefined && score > 0 && (
            <div className="flex items-baseline gap-3">
              <span className="text-5xl md:text-6xl font-bold text-white">{score}</span>
              <span className="text-gray-400">/ 100</span>
              <span className={`text-sm px-3 py-1 rounded-full ml-2 ${
                score >= 80 ? 'bg-green-500/20 text-green-400' : 
                score >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                {getScoreLabel(score)} Potential
              </span>
            </div>
          )}
        </motion.div>

        {/* Key Metrics Row - Only for location flow */}
        {metrics && (
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Foot Traffic</p>
              <p className="text-white font-medium">{metrics.footTraffic.level}</p>
              <p className="text-gray-600 text-sm">{metrics.footTraffic.score}/100</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Competition</p>
              <p className="text-white font-medium">{metrics.competition.level}</p>
              <p className="text-gray-600 text-sm">{metrics.competition.score}/100</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Spending Power</p>
              <p className="text-white font-medium">{metrics.spendingPower.level}</p>
              <p className="text-gray-600 text-sm">{metrics.spendingPower.score}/100</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Population Density</p>
              <p className="text-white font-medium">{metrics.populationDensity.level}</p>
              <p className="text-gray-600 text-sm">{metrics.populationDensity.score}/100</p>
            </div>
          </motion.div>
        )}

        {/* Market Insight Banner */}
        {marketInsight && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/30 border border-white/10 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-gray-400 text-sm mb-1">Key Market Insight</p>
                  <p className="text-white text-lg">{marketInsight}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Financial Insights - Real Data */}
        {primaryFinancial && (
          <motion.div variants={itemVariants} className="mb-12">
            <div className="bg-zinc-900/30 border border-white/10 rounded-xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="text-gray-400" size={20} />
                <h2 className="text-lg font-medium text-white">Financial Projection</h2>
                <span className="text-xs text-gray-500 ml-auto">Based on AI analysis</span>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-500 text-sm mb-2">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-white">₹{primaryFinancial.monthly_revenue_estimate_inr}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-2">Profit Margin</p>
                  <p className="text-3xl font-bold text-green-400">{primaryFinancial.profit_margin_percent}%</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-2">Break-even</p>
                  <p className="text-3xl font-bold text-white">{primaryFinancial.break_even_months} months</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-2">Risk Level</p>
                  <p className={`text-3xl font-bold ${getRiskColor(primaryFinancial.risk_level)}`}>{primaryFinancial.risk_level}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendations Section with Enhanced Details */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="bg-zinc-900/30 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-medium text-white mb-6">
              {flowType === 'location' ? 'AI-Recommended Business Concepts' : 'Strategic Location Matches'}
            </h2>
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-zinc-800/30 rounded-lg p-5 border border-white/5">
                  <div className="flex items-start gap-4">
                    <span className="bg-white/10 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">{rec.name}</h3>
                        {rec.tag && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                            {rec.tag}
                          </span>
                        )}
                        {rec.category && (
                          <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-400">
                            {rec.category}
                          </span>
                        )}
                      </div>
                      
                      {rec.target_audience && (
                        <p className="text-gray-500 text-sm mb-3">Target: {rec.target_audience}</p>
                      )}
                      
                      <p className="text-gray-300 text-sm mb-3 leading-relaxed">{rec.reasoning}</p>
                      
                      {rec.unique_angle && (
                        <p className="text-blue-400 text-sm mb-3"><span className="font-medium">Unique Angle:</span> {rec.unique_angle}</p>
                      )}
                      
                      {rec.competitive_advantage && (
                        <p className="text-green-400 text-sm mb-3"><span className="font-medium">Competitive Advantage:</span> {rec.competitive_advantage}</p>
                      )}
                      
                      {rec.financial_projection && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Monthly Revenue</p>
                              <p className="text-white font-semibold">₹{rec.financial_projection.monthly_revenue_estimate_inr}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Profit Margin</p>
                              <p className="text-green-400 font-semibold">{rec.financial_projection.profit_margin_percent}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Break-even</p>
                              <p className="text-white font-semibold">{rec.financial_projection.break_even_months} months</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Risk</p>
                              <p className={`font-semibold ${getRiskColor(rec.financial_projection.risk_level)}`}>
                                {rec.financial_projection.risk_level}
                              </p>
                            </div>
                          </div>
                          
                          {/* Why This Will Work / What Could Go Wrong */}
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            {(rec.financial_projection.key_success_factors || rec.financial_projection.why_will_work) && (
                              <div className="bg-green-500/10 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle2 size={14} className="text-green-400" />
                                  <p className="text-green-400 text-sm font-medium">Why This Will Work</p>
                                </div>
                                <ul className="space-y-1">
                                  {(rec.financial_projection.key_success_factors || rec.financial_projection.why_will_work || []).map((factor, i) => (
                                    <li key={i} className="text-gray-300 text-xs">• {factor}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {(rec.financial_projection.potential_challenges || rec.financial_projection.what_could_go_wrong) && (
                              <div className="bg-red-500/10 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertTriangle size={14} className="text-red-400" />
                                  <p className="text-red-400 text-sm font-medium">What Could Go Wrong</p>
                                </div>
                                <ul className="space-y-1">
                                  {(rec.financial_projection.potential_challenges || rec.financial_projection.what_could_go_wrong || []).map((challenge, i) => (
                                    <li key={i} className="text-gray-300 text-xs">• {challenge}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Strategic Recommendation Banner */}
        {strategicRecommendation && (
          <motion.div variants={itemVariants} className="mb-12">
            <div className="bg-gradient-to-r from-blue-900/30 to-zinc-900/30 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Target className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-blue-400 text-sm font-medium mb-1">Strategic Recommendation</p>
                  <p className="text-white">{strategicRecommendation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Two Column Layout - Premium Insights */}
        {premiumInsights && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Market Analysis */}
            <motion.div variants={itemVariants}>
              <div className="bg-zinc-900/30 border border-white/10 rounded-xl p-6 h-full">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="text-gray-400" size={20} />
                  <h2 className="text-lg font-medium text-white">Market Analysis</h2>
                </div>
                <div className="space-y-4">
                  {premiumInsights.market_overview && (
                    <p className="text-gray-300 text-sm leading-relaxed">{premiumInsights.market_overview}</p>
                  )}
                  {premiumInsights.competitive_landscape && (
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Competitive Landscape</p>
                      <p className="text-gray-300 text-sm">{premiumInsights.competitive_landscape}</p>
                    </div>
                  )}
                  {premiumInsights.market_trends && (
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Market Trends</p>
                      <p className="text-gray-300 text-sm">{premiumInsights.market_trends}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Customer Demographics */}
            <motion.div variants={itemVariants}>
              <div className="bg-zinc-900/30 border border-white/10 rounded-xl p-6 h-full">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="text-gray-400" size={20} />
                  <h2 className="text-lg font-medium text-white">Customer Demographics</h2>
                </div>
                <div className="space-y-4">
                  {premiumInsights.demographic_profile && (
                    <>
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-gray-400">Primary Segment</span>
                        <span className="text-white font-medium">{premiumInsights.demographic_profile.primary_segment}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-gray-400">Income Level</span>
                        <span className="text-white font-medium">{premiumInsights.demographic_profile.income_level}</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-gray-400">Spending Behavior</span>
                        <span className="text-white font-medium">{premiumInsights.demographic_profile.spending_behavior}</span>
                      </div>
                    </>
                  )}
                  {premiumInsights.demand_analysis && (
                    <div className="pt-3 border-t border-white/5 mt-4">
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Demand Analysis</p>
                      <div className="space-y-2">
                        <p className="text-gray-300 text-sm"><span className="text-gray-400">Level:</span> {premiumInsights.demand_analysis.demand_level}</p>
                        <p className="text-gray-300 text-sm"><span className="text-gray-400">Growth:</span> {premiumInsights.demand_analysis.growth_trajectory}</p>
                        <p className="text-gray-300 text-sm"><span className="text-gray-400">Seasonal:</span> {premiumInsights.demand_analysis.seasonal_factors}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Strategic Recommendations */}
        <motion.div variants={itemVariants}>
          <div className="bg-zinc-900/30 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Target className="text-gray-400" size={20} />
              <h2 className="text-lg font-medium text-white">Strategic Recommendations</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <TrendingUp size={16} />
                  <span className="text-sm uppercase tracking-wider">Pricing Strategy</span>
                </div>
                <p className="text-white">Premium pricing model recommended. Target customers show willingness to pay for quality.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <MapPin size={16} />
                  <span className="text-sm uppercase tracking-wider">Best Micro-Location</span>
                </div>
                <p className="text-white">Main street visibility with 50m radius from metro station or bus stop.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Clock size={16} />
                  <span className="text-sm uppercase tracking-wider">Peak Hours</span>
                </div>
                <p className="text-white">8-10 AM, 12-2 PM, 6-9 PM on weekdays. 10 AM - 8 PM on weekends.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
