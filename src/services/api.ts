const API_BASE_URL = 'http://localhost:8000';

export interface FinancialProjection {
  monthly_revenue_estimate_inr: string;
  profit_margin_percent: string;
  break_even_months: string;
  risk_level: string;
  key_success_factors?: string[];
  potential_challenges?: string[];
  why_will_work?: string[];
  what_could_go_wrong?: string[];
}

export interface Recommendation {
  name: string;
  area?: string;
  reasoning: string;
  tag?: string;
  category?: string;
  target_audience?: string;
  unique_angle?: string;
  competitive_advantage?: string;
  optimal_format?: string;
  financial_projection?: FinancialProjection;
}

export interface PremiumInsights {
  market_overview?: string;
  demographic_profile?: {
    primary_segment: string;
    income_level: string;
    spending_behavior: string;
  };
  competitive_landscape?: string;
  strategic_opportunities?: string[];
  market_trends?: string;
  demand_analysis?: {
    demand_level: string;
    growth_trajectory: string;
    seasonal_factors: string;
  };
  investment_landscape?: string;
}

export interface LocationResponse {
  location: string;
  score: number;
  metrics: {
    foot_traffic: { level: string; score: number };
    competition: { level: string; score: number };
    spending_power: { level: string; score: number };
    population_density: { level: string; score: number };
  };
  area_type: string;
  demand_trend: string;
  is_estimated: boolean;
  recommendations: Recommendation[];
  market_insight?: string;
  premium_insights?: PremiumInsights;
  gemini_used?: boolean;
  fallback_used?: boolean;
  fallback_reason?: string | null;
}

export interface ProductResponse {
  product: string;
  recommendations: Recommendation[];
  strategic_recommendation?: string;
  premium_insights?: PremiumInsights;
  gemini_used?: boolean;
  fallback_used?: boolean;
  fallback_reason?: string | null;
  is_fallback_product?: boolean;
}

export async function analyzeLocation(location: string): Promise<LocationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/analyze-location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ area: location }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to analyze location');
  }

  const data = await response.json();
  console.log('API RESPONSE - Location:', data);
  return data;
}

export async function analyzeProduct(product: string): Promise<ProductResponse> {
  const response = await fetch(`${API_BASE_URL}/api/analyze-product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product: product }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to analyze product');
  }

  const data = await response.json();
  console.log('API RESPONSE - Product:', data);
  return data;
}
