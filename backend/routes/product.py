from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

try:
    from backend.services.scoring import analyze_product
    from backend.services.gemini_service import explain_locations, get_premium_insights
except ImportError:
    from services.scoring import analyze_product
    from services.gemini_service import explain_locations, get_premium_insights

router = APIRouter()


class ProductRequest(BaseModel):
    product: str


@router.post("/analyze-product")
def analyze_product_endpoint(request: ProductRequest):
    result = analyze_product(request.product)
    
    # Handle case where analyze_product returns None (should not happen now)
    if not result:
        raise HTTPException(status_code=400, detail="Unable to analyze product")
    
    # Check if this was a fallback product match
    is_fallback_product = result.get("is_fallback_product", False)

    # Get AI explanation for the top 3 locations
    ai_data, ai_error = explain_locations(request.product, result["recommendations"])
    gemini_used = ai_data is not None
    
    # Create structured recommendations with real area data
    recommendations = []
    strategic_recommendation = None
    
    if gemini_used and ai_data:
        # Use AI-generated location analyses
        location_analyses = ai_data.get("location_analyses", [])
        strategic_recommendation = ai_data.get("strategic_recommendation", "")
        
        for i, rec in enumerate(result["recommendations"]):
            area_name = rec["area"]
            area_score = rec["score"]
            area_type = rec["area_type"]
            
            # Get AI analysis for this location if available
            ai_analysis = location_analyses[i] if i < len(location_analyses) else {}
            financial = ai_analysis.get("financial_projection", {}) if ai_analysis else {}
            
            recommendations.append({
                "area": area_name,
                "score": area_score,
                "area_type": area_type,
                "reasoning": ai_analysis.get("why_this_fits", "") if ai_analysis else generate_fallback_reasoning(area_name, area_type, request.product),
                "competitive_advantage": ai_analysis.get("competitive_advantage", "") if ai_analysis else "",
                "optimal_format": ai_analysis.get("optimal_format", "") if ai_analysis else "",
                "tag": "Best Match" if area_score >= 85 else "Good Match" if area_score >= 75 else "Suitable",
                "financial_projection": {
                    "monthly_revenue_estimate_inr": financial.get("monthly_revenue_estimate_inr", "400000") if financial else "400000",
                    "profit_margin_percent": financial.get("profit_margin_percent", "20") if financial else "20",
                    "break_even_months": financial.get("break_even_months", "12") if financial else "12",
                    "risk_level": financial.get("risk_level", "Medium") if financial else "Medium",
                    "why_will_work": financial.get("why_will_work", []) if financial else [],
                    "what_could_go_wrong": financial.get("what_could_go_wrong", []) if financial else []
                }
            })
    else:
        # Fallback: Generate intelligent reasoning based on area characteristics
        for rec in result["recommendations"]:
            area_name = rec["area"]
            area_score = rec["score"]
            area_type = rec["area_type"]
            
            reasoning = generate_fallback_reasoning(area_name, area_type, request.product)
            
            # Generate fallback financial projections based on area type and score
            if area_type == "IT Hub":
                revenue = "550000" if area_score >= 80 else "450000"
                margin = "28" if area_score >= 80 else "22"
                break_even = "10" if area_score >= 80 else "14"
                risk = "Medium"
            elif area_type == "Commercial":
                revenue = "600000" if area_score >= 80 else "480000"
                margin = "32" if area_score >= 80 else "25"
                break_even = "8" if area_score >= 80 else "12"
                risk = "Medium"
            elif area_type == "Residential":
                revenue = "450000" if area_score >= 80 else "350000"
                margin = "30" if area_score >= 80 else "25"
                break_even = "9" if area_score >= 80 else "12"
                risk = "Low"
            else:  # Mixed
                revenue = "500000" if area_score >= 80 else "400000"
                margin = "28" if area_score >= 80 else "22"
                break_even = "10" if area_score >= 80 else "13"
                risk = "Medium"
            
            recommendations.append({
                "area": area_name,
                "score": area_score,
                "area_type": area_type,
                "reasoning": reasoning,
                "competitive_advantage": f"Strong positioning in {area_type} area with {area_score}% match score",
                "optimal_format": "Standard storefront with local market adaptation",
                "tag": "Best Match" if area_score >= 85 else "Good Match" if area_score >= 75 else "Suitable",
                "financial_projection": {
                    "monthly_revenue_estimate_inr": revenue,
                    "profit_margin_percent": margin,
                    "break_even_months": break_even,
                    "risk_level": risk,
                    "why_will_work": [
                        f"{area_score}% location match score indicates strong fit",
                        f"{area_type} area characteristics align with product requirements"
                    ],
                    "what_could_go_wrong": [
                        "Competition intensity may vary from estimates",
                        "Local regulations could impact operations"
                    ]
                }
            })

    fallback_used = not gemini_used or len(recommendations) == 0
    fallback_reason = ai_error if ai_error else ("Gemini API unavailable" if not gemini_used else None)

    # If product was a fallback match, update fallback reason
    if is_fallback_product:
        fallback_used = True
        fallback_reason = f"'{request.product}' not found in database. Using generic retail criteria."
    
    # Get additional premium insights if AI succeeded
    premium_insights = None
    if gemini_used:
        product_data_for_premium = {
            "product": result["product"],
            "recommendations": result["recommendations"]
        }
        premium_insights = get_premium_insights("product", product_data_for_premium)

    return {
        "product": result["product"],
        "recommendations": recommendations,
        "gemini_used": gemini_used,
        "fallback_used": fallback_used,
        "fallback_reason": fallback_reason,
        "is_fallback_product": is_fallback_product,
        "strategic_recommendation": strategic_recommendation,
        "premium_insights": premium_insights
    }


def generate_fallback_reasoning(area_name, area_type, product):
    """Generate intelligent fallback reasoning based on area type."""
    reasonings = {
        "IT Hub": f"{area_name} attracts high-earning IT professionals with consistent disposable income. The tech workforce values quality and convenience, creating reliable demand for {product}. Evening and weekend foot traffic from young professionals provides stable revenue potential.",
        "Commercial": f"{area_name} offers sustained foot traffic from office workers, shoppers, and business visitors throughout the day. High visibility and accessibility make it ideal for {product} to capture both planned and impulse visits.",
        "Residential": f"{area_name} provides a captive customer base of local residents with recurring daily needs. The neighborhood setting fosters loyalty and repeat business, essential for {product} sustainability.",
        "Mixed": f"{area_name} combines the stability of residential customers with the volume of commercial foot traffic. This dual customer base reduces risk and provides multiple revenue peaks throughout the day for {product}."
    }
    return reasonings.get(area_type, f"{area_name} offers strategic advantages for {product} based on local market conditions.")
