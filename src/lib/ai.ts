export async function getAIRecommendation(siteId: string) {
  const randomConfidence = Math.random() * 0.3 + 0.7;

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
      location: { lat: 9.7500, lng: 10.5000 },
    },
    {
      id: "3",
      name: "Obudu Cattle Ranch",
      state: "Cross River",
      location: { lat: 6.3833, lng: 9.1667 },
    },
  ];

  return {
    site_id: siteId,
    site_name: `Tourist Site ${siteId}`,
    suggestion:
      "Based on recent data, this destination offers stable infrastructure and is recommended for cultural tourism.",
    confidence: randomConfidence,
    generated_at: new Date().toISOString(),
    alternative_sites: mockAlternatives.slice(0, 2),
  };
}