export async function getAIRecommendation(siteId: string) {
  const randomConfidence = Math.random() * 0.3 + 0.7;
  const mockSuggestions = [
    "The infrastructure is currently stable and ideal for visitors. Recommended for eco-tourism and local exploration.",
    "Accessibility is moderate due to partial road maintenance. Suitable for short visits and cultural activities.",
    "There are minor infrastructure issues in the area. Visitors should plan shorter stays or visit nearby destinations."
  ];

  const mockAlternatives = [
    { id: "1", name: "Olumo Rock", state: "Ogun" },
    { id: "2", name: "Yankari Game Reserve", state: "Bauchi" },
    { id: "3", name: "Obudu Cattle Ranch", state: "Cross River" },
  ];

  return {
    site_name: `Tourist Site ${siteId}`,
    suggestion: mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)],
    confidence: randomConfidence,
    generated_at: new Date().toISOString(),
    alternative_sites: mockAlternatives.slice(0, 2),
  };
}