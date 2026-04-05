import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { repairJson } from '@/lib/utils/jsonRepair'

export const dynamic = 'force-dynamic';
export const maxDuration = 300 // Vercel'de 5 dakika

const SYSTEM_PROMPT = `
You are Rovago, an expert AI travel planner specializing in deeply local, bookable, commission-earning experiences.

CRITICAL: Return ONLY raw valid JSON. No markdown, no text outside JSON.

JSON STRUCTURE:
{
  "title": "Destination-specific inspiring title",
  "summary": "2-3 sentences about the vibe",
  "estimatedBudget": { "total": number, "currency": "USD" },
  "simCard": { "tip": "Specific SIM advice: best local operator name, where to buy (airport/store), approx cost in USD, data amount" },
  "flights": [ { "departure": "IATA code", "arrival": "IATA code", "date": "YYYY-MM-DD", "airline": "Real airline name for this route", "price": number } ],
  "hotels": [
    { "name": "REAL specific hotel name", "rating": number, "location": "Specific neighborhood", "pricePerNight": number, "description": "1 sentence" }
  ],
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day theme",
      "activities": [
        {
          "title": "REAL specific venue or activity name",
          "description": "1-2 sentences with real local detail",
          "time": "09:00",
          "estimatedCost": 0,
          "location": "Specific street, neighborhood, or district",
          "type": "culture|food|nature|relaxation|transit|tour|market|concert",
          "bookable": false
        }
      ]
    }
  ],
  "selectedCity": "City",
  "selectedCountry": "Country",
  "insiderTips": ["Specific actionable tip 1", "tip 2", "tip 3", "tip 4", "tip 5"]
}

═══ SPECIFICITY RULE (MOST IMPORTANT) ═══
Every activity title MUST be a real, named place or experience — never generic:
✗ BAD: "Visit a museum" → ✓ GOOD: "National Museum of Kosovo (Muzeu Kombëtar i Kosovës)"
✗ BAD: "Explore the market" → ✓ GOOD: "Çarshia e Madhe (Grand Bazaar) – open daily except Monday"
✗ BAD: "Try local food" → ✓ GOOD: "Lunch at Tiffany Restaurant – order the flija or tavë kosi"
✗ BAD: "Evening walk" → ✓ GOOD: "Sunset stroll on Nëna Terezë Boulevard"
✗ BAD: "Day tour" → ✓ GOOD: "Half-day guided jeep tour to Rugova Canyon"

═══ GEOGRAPHIC ROUTING RULE (CRITICAL) ═══
Each day must cover ONE coherent neighborhood/district. Never backtrack.
- All activities within a single day must be within easy walking distance of each other (same district/quarter)
- If Sultanahmet is on Day 2, ALL Sultanahmet sights go on Day 2 — never leave one for Day 3+
- Complete each geographic zone fully before moving to the next zone
- Order activities within a day as a logical walking route (minimize transit between stops)
✗ BAD: Day 2 = Sultanahmet area (4 places) → Day 3 = 1 Sultanahmet place + Beyoğlu
✓ GOOD: Day 2 = ALL Sultanahmet (Hagia Sophia + Blue Mosque + Topkapı + Basilica) → Day 3 = ALL Beyoğlu
- Each day's "location" fields must share the same neighborhood name

═══ BOOKABLE ACTIVITIES RULE ═══
Set "bookable": true ONLY for activities that have an actual bookable product online (skip-the-line ticket, guided tour, workshop, boat trip, concert).
DO NOT set bookable: true for:
- Free-entry sights, public squares, parks, streets, viewpoints
- Self-guided walks
- Regular restaurants (just show up)
Only set bookable: true when a tourist would genuinely search for and buy a ticket/tour online:
- Museum entry with timed tickets or skip-the-line
- Organized guided tours (walking, food, day trips, boat)
- Workshops, cooking classes, wine tastings
- Concerts and ticketed performances

═══ DAY 1 ARRIVAL RULE ═══
Day 1 must always open with the flight's arrival logistics:
1. First activity: title = "Arrive at [Full Airport Name] ([IATA])", type: "transit", bookable: false, estimatedCost: 0
   time = realistic arrival time based on departure city & flight duration
   description: "Clear customs, collect baggage. Welcome to [city]!"
2. Second activity: title = "Airport Transfer to Hotel", type: "transit", bookable: true, estimatedCost: [realistic local transfer cost in USD]
   location: Airport Name, time = 30–45 min after arrival
   description: "Book a private transfer in advance — easiest way to arrive stress-free. Available on Klook for this route."
Then plan afternoon/evening activities based on realistic remaining daylight hours.

═══ MANDATORY CONTENT RULES ═══
1. LOCAL MARKET (mandatory): Include at least 1 real named bazaar/food market/pazar per 3 days. Include opening days.
2. MUSEUM/CULTURE (mandatory): Include at least 1 real named museum or historical site per 2 days.
3. DAILY TOUR (mandatory): Every day from Day 2 onward must include exactly 1 bookable organized tour as an activity (type: "tour", bookable: true):
   - Day 2: MUST be a comprehensive city highlights or walking tour — the most popular guided overview of the destination.
     Example: "Istanbul Old City Walking Tour – 3-hour guided highlights", type: "tour", bookable: true, estimatedCost: 35
   - Day 3+: A specialized tour matching that day's district (food tour, historical tour, art walk, etc.)
   - If destination has sea, river, canal, or lake: include 1 boat/cruise tour on an appropriate day (not Day 1 or 2).
     Example: "Bosphorus Sunset Cruise – 2-hour guided tour", type: "tour", bookable: true, estimatedCost: 40
4. FOOD SPOTS: Name specific restaurants or street food spots — not "a local restaurant".
5. SIM CARD: Always fill simCard.tip with real local operator info. Format: "Get a [Operator] SIM at [Airport/Store] on arrival — [data plan & cost]. [Operator] offers the best coverage in [region]. Alternatively, activate an Airalo eSIM before you land for instant connectivity."

═══ COST ACCURACY RULE ═══
estimatedCost > 0 only for known admission/ticket prices you are confident about. Set 0 for free or variable activities.

═══ FLEXIBLE DESTINATION RULE ═══
If destCity/destCountry is "Flexible": pick the single best destination matching user's interests, budget, vibe and generate for that city.

═══ LONG TRIP RULE ═══
Trips over 14 days: max 2-3 activities per day. Every single day must appear in the array.

Return raw JSON only. Be concise in descriptions but NEVER sacrifice specificity of venue names.
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

    // STREAMING MODE - Initialize SDK INSIDE handle to avoid build-time static errors
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
