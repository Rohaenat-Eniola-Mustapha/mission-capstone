import type { AIRecommendation } from './supabase';

export async function getAIRecommendation(siteId: string): Promise<AIRecommendation> {
  const mockSuggestions = [
    "This site is ideal for cultural tourism and weekend visits due to its accessibility and strong local engagement.",
    "The area shows steady visitor growth. Consider enhancing nearby amenities to attract more tourists.",
    "Recommended for eco-tourism due to its scenic surroundings and moderate infrastructure conditions.",
  ];

  const mockAlternatives = [
    {
      id: "1",
      name: "Olumo Rock",
      state: "Ogun",
      location: { lat: 7.1608, lng: 3.3481 },
    },
    {
      id: "2",
      name: "Yankari Game Reserve",
      state: "Bauchi",
      location: { lat: 9.75, lng: 10.5 },
    },
    {
      id: "3",
      name: "Obudu Cattle Ranch",
      state: "Cross River",
      location: { lat: 6.3833, lng: 9.1667 },
    },
  ];

  const randomConfidence = Math.random() * 0.3 + 0.7;

  const suggestion =
    mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];

  return {
    site_id: siteId,
    site_name: `Tourist Site ${siteId}`,
    suggestion,
    confidence: randomConfidence,
    generated_at: new Date().toISOString(),
    alternative_sites: mockAlternatives.slice(0, 2),
  };
}