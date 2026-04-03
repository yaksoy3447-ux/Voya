import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { repairJson } from '@/lib/utils/jsonRepair'

export const maxDuration = 300 // Vercel'de 5 dakika

const SYSTEM_PROMPT = `
You are Voya, an expert, high-end AI travel planner.
You receive a set of travel parameters (departure, destination, dates, companions, budget, interests, pace).
You MUST generate a complete, day-by-day itinerary for EVERY single day between startDate and endDate (inclusive).
The number of days in the "days" array MUST exactly match the number of days of the trip (calculated from startDate to endDate).
Strictly return ONLY valid JSON matching this structure:
{
  "title": "Inspiring title for the trip",
  "summary": "2-3 sentences summarizing the vibe of the trip",
  "estimatedBudget": { "total": number, "currency": "USD" },
  "flights": [ { "departure": "Airport Code", "arrival": "Airport Code", "date": "YYYY-MM-DD", "airline": "String", "price": number } ],
  "hotels": [
     { "name": "Boutique/Luxury Hotel", "rating": 4.8, "location": "Prime Neighborhood", "pricePerNight": number, "description": "Compelling 1-sentence description" },
     { "name": "Mid-range/Comfort Hotel", "rating": 4.5, "location": "Strategic Area", "pricePerNight": number, "description": "Compelling 1-sentence description" }
  ],
  "days": [
    {
       "day": 1,
       "date": "YYYY-MM-DD",
       "title": "Day Theme",
       "activities": [
         { "title": "Activity Name", "description": "Short description", "time": "09:00 AM", "estimatedCost": 25, "location": "String", "type": "culture|food|nature|relaxation|transit" }
       ]
    }
  ],
  "selectedCity": "City Name",
  "selectedCountry": "Country Name",
  "insiderTips": [ "High-value travel advice 1", "Advice 2", "Advice 3" ]
}
CRITICAL: The "days" array must contain one entry per day of the trip. If the trip is 7 days, there must be exactly 7 day objects.
IMPORTANT: Always provide at least 2-3 diverse hotel options and at least 2 flight options (Outbound/Inbound).
The tone should be sophisticated, inspiring, and helpful. Do not write any markdown blocks or explanations outside the JSON. Return raw JSON.
Keep activity descriptions concise (1-2 sentences max). Be efficient with tokens.

COST ACCURACY RULE: For "estimatedCost", only include a non-zero value if you are highly confident in the real, current admission or entry price (e.g. well-known museum fees, ticket prices). Convert to USD. If you are unsure or the activity is free/variable (walking, parks, street food browsing), set estimatedCost to 0. Never guess or round up costs. Accuracy is more important than completeness.

SPECIAL CASE: If "destCity" or "destCountry" is "Flexible", it means the user doesn't know where to go.
In this case, you MUST FIRST independently decide on 3 specific, world-class destinations (City, Country) that match the user's "interests", "budget", "vibe", and "pace".
Select the absolute best one for their profile and then generate the complete itinerary for THAT specific destination.
The "title" of the trip should reflect the selected destination.

TOKEN EFFICIENCY RULE: Be extremely concise. Use short phrases. Avoid long floral descriptions.
Efficiency is speed. Faster responses provide better UX.

LOCAL MARKETS RULE: Research and include specific local bazaars, food markets, and traditional shopping spots (e.g., "Çarşı/Pazar"). Mention their specific opening days if it adds value.

LONG TRIP RULE: For trips longer than 14 days, you MUST be ultra-concise. Limit to 1-2 key activities per day to stay within token limits. Ensure EVERY single day is represented in the output (e.g. if 25 days, output 25 days).
`;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const data = await req.json();

    // Plan count check for Free users
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('tier, plan_count').eq('id', user.id).single();
      if (profile && profile.tier === 'Free' && profile.plan_count >= 3) {
        return Response.json({ error: "LIMIT_REACHED" }, { status: 403 });
      }
    }

    // MOCK MODE: No API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn("ANTHROPIC_API_KEY not found — returning mock data.");
      await new Promise(r => setTimeout(r, 2500));

      const city = data.destCity === "Flexible" ? "Amalfi" : data.destCity;
      const country = data.destCountry === "Flexible" ? "Italy" : data.destCountry;
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const numDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      const dayTitles = ["Arrival & First Impressions","Exploring the Heart","Hidden Gems Day","Culture & Cuisine","Adventure Day","Relaxation & Reflection","Farewell Morning","Off the Beaten Path","Sunset Chasing","Local Life Day","Markets & Flavors","Coastal Escape","Mountain Trails","City Highlights"];
      const mockDays = Array.from({ length: numDays }, (_, i) => {
        const d = new Date(start); d.setDate(start.getDate() + i);
        return { day: i+1, date: d.toISOString().split('T')[0], title: dayTitles[i % dayTitles.length],
          activities: [
            { title: i===0?"Check-in & Settle":`Morning Exploration`, description:`Discover ${city} highlights.`, time:"09:00", estimatedCost:0, location:city, type:"culture" },
            { title:"Local Lunch", description:`Authentic ${country} cuisine.`, time:"13:00", estimatedCost:0, location:`${city} center`, type:"food" },
            { title:i===numDays-1?"Farewell Dinner":"Evening Stroll", description:`Evening in ${city}.`, time:"19:30", estimatedCost:0, location:city, type:"relaxation" }
          ]};
      });
      const mockData = {
        title:`${city} ${numDays}-Day Journey`, summary:`${numDays} days in ${city}, ${country}.`,
        estimatedBudget:{total:numDays*350,currency:"USD"},
        flights:[{departure:data.depCity,arrival:city,date:data.startDate,airline:"Sample Airways",price:620},{departure:city,arrival:data.depCity,date:data.endDate,airline:"Sample Airways",price:620}],
        hotels:[{name:"Grand Boutique Hotel",rating:4.9,location:`${city} Old Town`,pricePerNight:280,description:`Iconic boutique hotel in ${city}.`},{name:"Comfort Inn",rating:4.5,location:`${city} Central`,pricePerNight:120,description:`Well-located mid-range option.`}],
        days:mockDays, insiderTips:["Visit early to beat crowds.","Try local street food.","Carry some cash."]
      };
      return Response.json(mockData);
    }

    // STREAMING MODE
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const userPrompt = `Parameters:\n${JSON.stringify(data, null, 2)}`;

    const stream = new ReadableStream({
      async start(controller) {
        let fullText = '';
        try {
          const messageStream = anthropic.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 12000,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: userPrompt }]
          });

          for await (const chunk of messageStream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              fullText += chunk.delta.text;
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }

          // DB'ye kaydet
          if (user) {
            try {
              const cleaned = fullText.replace(/```json/g, '').replace(/```/g, '').trim();
              const repaired = repairJson(cleaned);
              const finalData = JSON.parse(repaired);
              const { error: insertError } = await supabase.from('plans').insert({
                user_id: user.id,
                title: finalData.title,
                destination: finalData.selectedCity || data.destCity || 'Unknown',
                budget: data.budget || 'mid',
                itinerary: finalData
              });
              if (!insertError) {
                const { error: rpcError } = await supabase.rpc('increment_plan_count', { row_id: user.id });
                if (rpcError) {
                  const { data: p } = await supabase.from('profiles').select('plan_count').eq('id', user.id).single();
                  if (p) await supabase.from('profiles').update({ plan_count: p.plan_count + 1 }).eq('id', user.id);
                }
              }
            } catch (saveErr) {
              console.error('Plan save error:', saveErr);
            }
          }
        } catch (err) {
          console.error('Streaming error:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      }
    });

  } catch (error: unknown) {
    console.error("Generate Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
