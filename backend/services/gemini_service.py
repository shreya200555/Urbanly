import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Debug: Print key status (mask the actual key)
if GEMINI_API_KEY:
    print(f"DEBUG: Gemini API Key loaded. Length: {len(GEMINI_API_KEY)}, First 10 chars: {GEMINI_API_KEY[:10]}...")
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash")
    print("DEBUG: Gemini model configured successfully")
else:
    print("DEBUG: WARNING - No Gemini API Key found in environment!")
    model = None


def get_business_suggestions(location_data):
    """Generate specific, niche business recommendations with financial insights."""
    if not model:
        return None, "AI insights unavailable. Add GEMINI_API_KEY to .env"

    area_name = location_data.get('area', 'Unknown Area')
    
    prompt = f"""You are an expert business consultant analyzing commercial opportunities.

LOCATION PROFILE:
- Area: {area_name}, Bangalore
- Area Type: {location_data['area_type']}
- Foot Traffic: {location_data['raw_metrics']['foot_traffic']}/100
- Competition Density: {location_data['raw_metrics']['competition']}/100
- Spending Power: {location_data['raw_metrics']['spending_power']}/100
- Population Density: {location_data['raw_metrics']['population_density']}/100
- Demand Trend: {location_data['demand_trend']}

Generate 3 SPECIFIC, NICHE business concepts for this location. Avoid generic suggestions like "Coffee Shop" or "Gym".

Instead suggest concepts like:
- "Specialty pour-over coffee bar with co-working space" (not just "Coffee Shop")
- "Boutique Pilates studio with nutrition coaching" (not just "Gym")
- "Premium Korean skincare pop-up targeting office workers"
- "Fast-casual poke bowl concept for lunch crowd"

Return JSON format:
{{
  "recommendations": [
    {{
      "business_concept": "Specific niche concept name",
      "category": "Food/Retail/Wellness/Service",
      "target_audience": "Specific demographic (e.g., '25-35 IT professionals, lunch crowd')",
      "why_this_location": "2-3 sentences of practical insight about WHY this specific concept works HERE specifically",
      "unique_angle": "What makes this different from generic competition",
      "financial_projection": {{
        "monthly_revenue_estimate_inr": "450000",
        "profit_margin_percent": "25",
        "break_even_months": "8",
        "risk_level": "Low/Medium/High",
        "key_success_factors": ["factor 1", "factor 2"],
        "potential_challenges": ["challenge 1", "challenge 2"]
      }}
    }}
  ],
  "market_insight": "One sharp insight about this location's commercial opportunity"
}}

Requirements:
1. Business concepts must be SPECIFIC and NICHE (not generic categories)
2. Target audience must be precise demographics
3. 'why_this_location' must reference actual location data patterns
4. Financial projections must be realistic for Bangalore market
5. Risk assessment should be honest about market realities
6. Tone: Professional, analytical, no fluff"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Extract JSON from response
        if "```json" in text:
            json_str = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            json_str = text.split("```")[1].split("```")[0].strip()
        else:
            json_str = text
            
        data = json.loads(json_str)
        return data, None
    except Exception as e:
        print(f"DEBUG: Gemini parsing error: {e}")
        print(f"DEBUG: Raw response: {text[:500] if 'text' in locals() else 'N/A'}")
        return None, f"AI analysis error: {str(e)}"


def explain_locations(product, locations):
    """Generate detailed location analysis for product flow with premium insights."""
    if not model:
        return None, "AI insights unavailable. Add GEMINI_API_KEY to .env"

    locations_str = "\n".join([
        f"- {loc['area']} (Match Score: {loc['score']}/100, Type: {loc['area_type']})"
        for loc in locations
    ])

    prompt = f"""You are a location intelligence analyst evaluating sites for a business.

BUSINESS: {product}

TOP LOCATION MATCHES:
{locations_str}

Provide strategic analysis in JSON format:
{{
  "location_analyses": [
    {{
      "area": "Location name",
      "why_this_fits": "2-3 sentences explaining the strategic fit. Reference specific area characteristics, demographics, foot traffic patterns. Be specific and practical.",
      "competitive_advantage": "What advantage this location gives vs competitors",
      "optimal_format": "Recommended business format for this location (e.g., 'Compact kiosk', 'Full-service store', 'Delivery-focused kitchen')",
      "financial_projection": {{
        "monthly_revenue_estimate_inr": "350000",
        "profit_margin_percent": "20",
        "break_even_months": "12",
        "risk_level": "Low/Medium/High",
        "why_will_work": "2-3 specific reasons this will succeed",
        "what_could_go_wrong": "2-3 honest risks/challenges"
      }}
    }}
  ],
  "strategic_recommendation": "Overall recommendation on which location to choose and why"
}}

Requirements:
1. Avoid generic statements like "high foot traffic makes it good"
2. Reference actual patterns: "Peak evening office crowd supports quick-service models"
3. 'why_this_fits' must connect business type to area demographics specifically
4. Financial projections must be realistic for Bangalore retail
5. Include honest risk assessment
6. Tone: Professional, analytical, actionable advice"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Extract JSON from response
        if "```json" in text:
            json_str = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            json_str = text.split("```")[1].split("```")[0].strip()
        else:
            json_str = text
            
        data = json.loads(json_str)
        return data, None
    except Exception as e:
        print(f"DEBUG: Gemini parsing error: {e}")
        print(f"DEBUG: Raw response: {text[:500] if 'text' in locals() else 'N/A'}")
        return None, f"AI analysis error: {str(e)}"


def get_premium_insights(flow_type, data):
    """Generate additional premium insights for the dashboard."""
    if not model:
        return None
    
    if flow_type == 'location':
        area = data.get('area', 'Unknown')
        metrics = data.get('metrics', {})
        
        prompt = f"""Generate premium market intelligence for {area}, Bangalore.

Location Metrics:
- Foot Traffic: {metrics.get('foot_traffic', {}).get('score', 0)}/100
- Competition: {metrics.get('competition', {}).get('score', 0)}/100  
- Spending Power: {metrics.get('spending_power', {}).get('score', 0)}/100
- Population Density: {metrics.get('population_density', {}).get('score', 0)}/100

Return JSON:
{{
  "market_overview": "2-3 sentence market summary for this area",
  "demographic_profile": {{
    "primary_segment": "Main demographic group",
    "income_level": "Estimated income bracket",
    "spending_behavior": "How they spend - frequency, preferences"
  }},
  "competitive_landscape": "Analysis of existing competition and gaps",
  "strategic_opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "market_trends": "Current trends affecting this area"
}}

Tone: Professional market research report. Be specific, not generic."""
    else:
        product = data.get('product', 'Unknown')
        locations = data.get('recommendations', [])
        loc_names = [loc.get('area', 'Unknown') for loc in locations]
        
        prompt = f"""Generate premium market intelligence for {product} business.

Top Recommended Locations: {', '.join(loc_names)}

Return JSON:
{{
  "market_overview": "2-3 sentence market summary for this product category in Bangalore",
  "demand_analysis": {{
    "demand_level": "High/Medium/Low with explanation",
    "growth_trajectory": "Growing/Stable/Declining with reasoning",
    "seasonal_factors": "Any seasonal patterns to consider"
  }},
  "investment_landscape": "Capital requirements and ROI outlook",
  "strategic_opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "market_trends": "Current trends affecting this business type"
}}

Tone: Professional market research report. Be specific, not generic."""
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        if "```json" in text:
            json_str = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            json_str = text.split("```")[1].split("```")[0].strip()
        else:
            json_str = text
            
        return json.loads(json_str)
    except Exception as e:
        print(f"DEBUG: Premium insights error: {e}")
        return None
