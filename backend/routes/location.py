from fastapi import APIRouter
from pydantic import BaseModel

try:
    from backend.services.scoring import analyze_location
    from backend.services.gemini_service import get_business_suggestions, get_premium_insights
except ImportError:
    from services.scoring import analyze_location
    from services.gemini_service import get_business_suggestions, get_premium_insights

router = APIRouter()


class LocationRequest(BaseModel):
    area: str


@router.post("/analyze-location")
def analyze_location_endpoint(request: LocationRequest):
    result = analyze_location(request.area)
    
    # Get AI business suggestions based on real location data
    ai_data, ai_error = get_business_suggestions(result)
    gemini_used = ai_data is not None
    
    # Parse structured recommendations from AI
    recommendations = []
    market_insight = None
    
    if gemini_used and ai_data:
        # Extract recommendations from structured JSON response
        ai_recs = ai_data.get("recommendations", [])
        for rec in ai_recs[:3]:  # Top 3
            financial = rec.get("financial_projection", {})
            recommendations.append({
                "name": rec.get("business_concept", "Business Opportunity"),
                "category": rec.get("category", "General"),
                "target_audience": rec.get("target_audience", ""),
                "reasoning": rec.get("why_this_location", ""),
                "unique_angle": rec.get("unique_angle", ""),
                "tag": "AI Recommended",
                "financial_projection": {
                    "monthly_revenue_estimate_inr": financial.get("monthly_revenue_estimate_inr", "400000"),
                    "profit_margin_percent": financial.get("profit_margin_percent", "20"),
                    "break_even_months": financial.get("break_even_months", "12"),
                    "risk_level": financial.get("risk_level", "Medium"),
                    "key_success_factors": financial.get("key_success_factors", []),
                    "potential_challenges": financial.get("potential_challenges", [])
                }
            })
        market_insight = ai_data.get("market_insight", "")
    
    # Fallback: If AI fails, add intelligent fallback based on area type
    fallback_used = not gemini_used or len(recommendations) == 0
    fallback_reason = None
    
    if fallback_used:
        fallback_reason = ai_error if ai_error else "Could not parse AI recommendations"
        area_type = result["area_type"]
        if area_type == "IT Hub":
            recommendations = [
                {
                    "name": "Premium Specialty Coffee Bar with Co-working Space",
                    "category": "Food & Beverage",
                    "target_audience": "25-35 IT professionals seeking quality workspace and coffee",
                    "reasoning": "High foot traffic from IT professionals seeking quality coffee and workspace. Peak morning and evening demand supports extended hours.",
                    "unique_angle": "Combines specialty coffee with dedicated co-working zones and meeting pods",
                    "tag": "High Demand",
                    "financial_projection": {
                        "monthly_revenue_estimate_inr": "550000",
                        "profit_margin_percent": "28",
                        "break_even_months": "10",
                        "risk_level": "Medium",
                        "key_success_factors": ["Consistent corporate clientele", "Premium pricing tolerance"],
                        "potential_challenges": ["High rental costs in IT corridors", "Need for high-quality coffee expertise"]
                    }
                },
                {
                    "name": "Fast-Casual Asian Fusion Restaurant",
                    "category": "Food & Beverage",
                    "target_audience": "Busy IT workers seeking quick, healthy lunch options",
                    "reasoning": "Busy professionals need fast, affordable dining options during limited lunch windows. IT crowd prefers healthy, trendy food.",
                    "unique_angle": "Build-your-own bowl concept with Korean/Japanese fusion, 5-minute service guarantee",
                    "tag": "High Profit",
                    "financial_projection": {
                        "monthly_revenue_estimate_inr": "800000",
                        "profit_margin_percent": "22",
                        "break_even_months": "8",
                        "risk_level": "Medium",
                        "key_success_factors": ["High volume lunch rush", "Recurring corporate orders"],
                        "potential_challenges": ["Intense competition from food courts", "Quality consistency at speed"]
                    }
                },
                {
                    "name": "Boutique Fitness Studio with Nutrition Coaching",
                    "category": "Wellness",
                    "target_audience": "Health-conscious IT professionals, 28-40 years",
                    "reasoning": "Growing demand for wellness services near workplaces. IT workers prioritize fitness for stress management.",
                    "unique_angle": "Morning yoga + evening HIIT classes with corporate wellness packages and meal planning",
                    "tag": "Low Competition",
                    "financial_projection": {
                        "monthly_revenue_estimate_inr": "450000",
                        "profit_margin_percent": "35",
                        "break_even_months": "14",
                        "risk_level": "Low",
                        "key_success_factors": ["Corporate wellness tie-ups", "High retention memberships"],
                        "potential_challenges": ["Requires skilled trainers", "Peak hours limited to mornings/evenings"]
                    }
                }
            ]
        elif area_type == "Commercial":
            recommendations = [
                {
                    "name": "Curated Lifestyle Retail Pop-up Gallery",
                    "category": "Retail",
                    "target_audience": "Urban professionals seeking unique products, 25-40 years",
                    "reasoning": "Commercial areas attract affluent shoppers during business hours. Pop-up model reduces risk while testing demand.",
                    "unique_angle": "Rotating selection of local artisan products with experiential shopping events",
                    "tag": "High Demand",
                    "financial_projection": {
                        "monthly_revenue_estimate_inr": "600000",
                        "profit_margin_percent": "40",
                        "break_even_months": "6",
                        "risk_level": "Medium",
                        "key_success_factors": ["High foot traffic from offices", "Premium pricing tolerance"],
                        "potential_challenges": ["Inventory management complexity", "Seasonal demand variations"]
                    }
                },
                {
                    "name": "Upscale Business Lunch Restaurant",
                    "category": "Food & Beverage",
                    "target_audience": "Corporate clients, business professionals for meetings",
                    "reasoning": "Commercial districts attract business diners throughout the day. Corporate expense accounts support premium pricing.",
                    "unique_angle": "Private dining rooms for meetings, express corporate lunch menu, evening cocktail lounge",
                    "tag": "High Profit",
                    "financial_projection": {
                        "monthly_revenue_estimate_inr": "1200000",
                        "profit_margin_percent": "25",
                        "break_even_months": "12",
                        "risk_level": "Medium",
                        "key_success_factors": ["Corporate client retention", "Private dining bookings"],
                        "potential_challenges": ["High setup and staffing costs", "Competition from established chains"]
                    }
                },
                {
                    "name": "Premium Business Services Hub",
                    "category": "Service",
                    "target_audience": "Small businesses, startups, entrepreneurs",
                    "reasoning": "Professional services thrive in commercial districts. Co-located services reduce client acquisition costs.",
                    "unique_angle": "Co-working + legal + accounting + design services under one roof with cross-referrals",
                    "tag": "Best Match",
                    "financial_projection": {
                        "monthly_revenue_estimate_inr": "350000",
                        "profit_margin_percent": "45",
                        "break_even_months": "10",
                        "risk_level": "Low",
                        "key_success_factors": ["Synergistic service offerings", "Established commercial address"],
                        "potential_challenges": ["Regulatory compliance complexity", "Multiple skill requirements"]
                    }
                }
            ]
        elif area_type == "Residential":
            recommendations = [
                {
                    "name": "Neighborhood Artisan Grocery & Meal Kits",
                    "category": "Retail",
                    "target_audience": "Working families, health-conscious residents",
                    "reasoning": "Daily needs of residents ensure consistent footfall. Premium positioning attracts quality-conscious families.",
                    "unique_angle": "Local organic produce + pre-prepped meal kits + community cooking classes",
                    "tag": "High Demand",
                    "financial_projection": {
                        "monthly_revenue_estimate_inr": "500000",
                        "profit_margin_percent": "30",
                        "break_even_months": "9",
                        "risk_level": "Low",
                        "key_success_factors": ["Repeat customer base", "Community loyalty"],
                        "potential_challenges": ["Perishable inventory management", "Supply chain for local produce"]
                    }
                },
                {
                    "name": "Comprehensive Wellness Pharmacy & Clinic",
                    "category": "Healthcare",
                    "target_audience": "Families, elderly residents, health-conscious individuals",
                    "reasoning": "Essential service for residential communities. 24/7 needs and chronic care drive consistent demand.",
                    "unique_angle": "Full-service pharmacy + telemedicine consultations + wellness products + home delivery",
                    "tag": "Stable",
                    "financial_projection": {
                        "monthly_revenue_estimate_inr": "400000",
                        "profit_margin_percent": "25",
                        "break_even_months": "8",
                        "risk_level": "Low",
                        "key_success_factors": ["Essential service demand", "Insurance partnerships"],
                        "potential_challenges": ["Regulatory requirements", "Inventory expiry management"]
                    }
                },
                {
                    "name": "Premium Unisex Salon & Spa Services",
                    "category": "Beauty & Wellness",
                    "target_audience": "Middle to high-income residents, working professionals",
                    "reasoning": "Personal grooming services in high demand in residential areas. Premium positioning differentiates from budget competitors.",
                    "unique_angle": "Family packages + express services for professionals + weekend spa treatments",
                    "tag": "Best Match",
                    "financial_projection": {
                        "monthly_revenue_estimate_inr": "380000",
                        "profit_margin_percent": "35",
                        "break_even_months": "11",
                        "risk_level": "Medium",
                        "key_success_factors": ["Loyal customer base", "Referral network"],
                        "potential_challenges": ["Skilled staff retention", "High competition from chain salons"]
                    }
                }
            ]
        else:  # Mixed
            recommendations = [
                {
                    "name": "All-Day Cafe with Event Space",
                    "category": "Food & Beverage",
                    "target_audience": "Mix of residents, workers, and visitors",
                    "reasoning": "Mixed areas attract diverse customers throughout the day. Multiple customer segments support extended hours.",
                    "unique_angle": "Morning coffee + lunch crowd + evening events + weekend workshops",
                    "tag": "High Demand",
                    "financial_projection": {
                        "monthly_revenue_estimate_inr": "550000",
                        "profit_margin_percent": "26",
                        "break_even_months": "10",
                        "risk_level": "Medium",
                        "key_success_factors": ["Diverse customer base", "Multiple revenue streams"],
                        "potential_challenges": ["Balancing different customer needs", "Extended operating hours costs"]
                    }
                },
                {
                    "name": "Holistic Wellness & Fitness Center",
                    "category": "Wellness",
                    "target_audience": "Health-conscious residents and nearby workers",
                    "reasoning": "Health-conscious residents and professionals value convenience. Mixed area provides access to both segments.",
                    "unique_angle": "Gym + yoga + nutrition counseling + physiotherapy under one roof",
                    "tag": "High Profit",
                    "financial_projection": {
                        "monthly_revenue_estimate_inr": "480000",
                        "profit_margin_percent": "38",
                        "break_even_months": "13",
                        "risk_level": "Medium",
                        "key_success_factors": ["Comprehensive service offering", "Membership retention"],
                        "potential_challenges": ["High equipment investment", "Requires multiple specialists"]
                    }
                },
                {
                    "name": "Curated Boutique with Local Artisans",
                    "category": "Retail",
                    "target_audience": "Urban shoppers seeking unique items, gift buyers",
                    "reasoning": "Diverse customer base supports specialty retail. Mixed foot traffic provides exposure to different segments.",
                    "unique_angle": "Local designer products + rotating exhibitions + artisan workshops",
                    "tag": "Best Match",
                    "financial_projection": {
                        "monthly_revenue_estimate_inr": "320000",
                        "profit_margin_percent": "42",
                        "break_even_months": "7",
                        "risk_level": "Medium",
                        "key_success_factors": ["Unique product curation", "Experiential shopping"],
                        "potential_challenges": ["Consignment model complexity", "Marketing to reach right audience"]
                    }
                }
            ]

    # Get additional premium insights if AI succeeded
    premium_insights = None
    if gemini_used:
        location_data_for_premium = {
            "area": result["location"],
            "metrics": {
                "foot_traffic": {"score": result["raw_metrics"]["foot_traffic"]},
                "competition": {"score": result["raw_metrics"]["competition"]},
                "spending_power": {"score": result["raw_metrics"]["spending_power"]},
                "population_density": {"score": result["raw_metrics"]["population_density"]}
            }
        }
        premium_insights = get_premium_insights("location", location_data_for_premium)

    return {
        "location": result["location"],
        "score": result["location_score"],
        "metrics": {
            "foot_traffic": {"level": result["foot_traffic"].split()[0], "score": result["raw_metrics"]["foot_traffic"]},
            "competition": {"level": result["competition"].split()[0], "score": result["raw_metrics"]["competition"]},
            "spending_power": {"level": result["spending_power"].split()[0], "score": result["raw_metrics"]["spending_power"]},
            "population_density": {"level": result["population_density"].split()[0], "score": result["raw_metrics"]["population_density"]}
        },
        "area_type": result["area_type"],
        "demand_trend": result["demand_trend"],
        "is_estimated": result["is_estimated"],
        "recommendations": recommendations[:3],
        "gemini_used": gemini_used,
        "fallback_used": fallback_used,
        "fallback_reason": fallback_reason,
        "market_insight": market_insight,
        "premium_insights": premium_insights
    }
