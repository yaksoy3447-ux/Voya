import { create } from 'zustand'

export interface ItineraryData {
  title: string;
  summary: string;
  estimatedBudget: { total: number; currency: string };
  flights: Array<{
    departure: string;
    arrival: string;
    date: string;
    airline: string;
    price: number;
  }>;
  hotels: Array<{
    name: string;
    rating: number;
    location: string;
    pricePerNight: number;
    description: string;
  }>;
  days: Array<{
    day: number;
    date: string;
    title: string;
    activities: Array<{
      title: string;
      description: string;
      time: string;
      estimatedCost: number;
      location: string;
      type: "food" | "culture" | "nature" | "relaxation" | "transit";
    }>;
  }>;
  insiderTips: string[];
}

interface PlanStore {
  itinerary: ItineraryData | null
  setItinerary: (plan: ItineraryData) => void
  clearItinerary: () => void
}

export const usePlanStore = create<PlanStore>((set) => ({
  itinerary: null,
  setItinerary: (plan) => set({ itinerary: plan }),
  clearItinerary: () => set({ itinerary: null })
}))
