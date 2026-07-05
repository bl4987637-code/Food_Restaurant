const Groq = require("groq-sdk");

// Lazy-load Groq client to ensure env variables are loaded first
let groqClient = null;

const getGroqClient = () => {
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqClient;
};

const CUISINE_KEYWORDS = {
  chaat: ["chaat", "streetfood", "tangy", "crispy"],
  biryani: ["biryani", "aromatic", "spicy", "flavorful"],
  kfc: ["friedchicken", "crispy", "fastfood", "bucket"],
  punjabi: ["paratha", "butter", "dhaba", "hearty"],
  curry: ["curry", "gravy", "masala", "comfortfood"],
  sushi: ["sushi", "fresh", "japanese", "premium"],
  spice: ["spices", "flavors", "authentic", "warm"],
};

const POSITIVE_WORDS = [
  "amazing",
  "delicious",
  "best",
  "love",
  "excellent",
  "great",
  "tasty",
  "fresh",
  "perfect",
  "awesome",
];

const NEGATIVE_WORDS = [
  "bad",
  "slow",
  "cold",
  "bland",
  "disappointing",
  "worst",
  "overpriced",
  "rude",
];

const getSentimentLabel = (score) => {
  if (score >= 4.5) return "Excellent";
  if (score >= 4.0) return "Very Positive";
  if (score >= 3.5) return "Positive";
  if (score >= 3.0) return "Mixed";
  return "Needs Improvement";
};

const detectCuisineTags = (name = "") => {
  const lower = name.toLowerCase();

  if (lower.includes("chaat")) return CUISINE_KEYWORDS.chaat;
  if (lower.includes("biryani") || lower.includes("thalappakatti") || lower.includes("meghana"))
    return CUISINE_KEYWORDS.biryani;
  if (lower.includes("kfc")) return CUISINE_KEYWORDS.kfc;
  if (lower.includes("punjabi") || lower.includes("dhaba")) return CUISINE_KEYWORDS.punjabi;
  if (lower.includes("curry")) return CUISINE_KEYWORDS.curry;
  if (lower.includes("sushi") || lower.includes("tokyo")) return CUISINE_KEYWORDS.sushi;
  if (lower.includes("spice")) return CUISINE_KEYWORDS.spice;

  return ["local", "popular", "foodie"];
};

const analyzeReviewComments = (reviews = []) => {
  const mentions = new Set();
  let positiveHits = 0;
  let negativeHits = 0;

  reviews.forEach((review) => {
    const comment = (review.Comment || review.comment || "").toLowerCase();

    POSITIVE_WORDS.forEach((word) => {
      if (comment.includes(word)) {
        positiveHits += 1;
        mentions.add(word);
      }
    });

    NEGATIVE_WORDS.forEach((word) => {
      if (comment.includes(word)) negativeHits += 1;
    });

    comment
      .split(/\s+/)
      .filter((word) => word.length > 4)
      .slice(0, 2)
      .forEach((word) => mentions.add(word.replace(/[^a-z]/g, "")));
  });

  return { positiveHits, negativeHits, mentions: [...mentions].filter(Boolean).slice(0, 4) };
};

// AI-powered summary generation using Groq
const generateAISummary = async (restaurant) => {
  const {
    name = "This restaurant",
    ratings = 0,
    numOfReviews = 0,
    isVeg = false,
    address = "",
    reviews = [],
  } = restaurant;

  try {
    const groq = getGroqClient();
    const recentReviews = reviews
      .slice(0, 10)
      .map((r) => `${r.name} (${r.rating}/5): ${r.Comment}`)
      .join("\n");

    const prompt = `You are a restaurant review summarizer. Based on the following restaurant data, provide a brief, engaging summary with 2-3 key insights:

Restaurant: ${name}
Rating: ${ratings}/5 (${numOfReviews} reviews)
Type: ${isVeg ? "Vegetarian" : "Mixed Menu"}
Address: ${address}

Recent Reviews:
${recentReviews || "No reviews yet"}

Provide 2-3 key insights as bullet points that would help customers decide if this restaurant is right for them. Be concise and specific.`;

    const message = await groq.messages.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiSummary = message.content[0].type === "text" ? message.content[0].text : "";
    return aiSummary;
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return null;
  }
};

// Generate food recommendations using Groq
const generateFoodRecommendations = async (restaurant) => {
  const { name = "This restaurant", reviews = [] } = restaurant;

  try {
    const groq = getGroqClient();
    const recentComments = reviews
      .filter((r) => r.Comment)
      .slice(0, 8)
      .map((r) => r.Comment)
      .join(" | ");

    const prompt = `Based on these customer reviews about ${name} restaurant, identify and list the top 3-4 most mentioned/recommended dishes or food categories. Be specific and concise.

Reviews: "${recentComments}"

Format your response as a JSON array of recommended items with a brief reason for each, like: [{"item": "Biryani", "reason": "customers praise its aromatic flavor"}]`;

    const message = await groq.messages.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 250,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response = message.content[0].type === "text" ? message.content[0].text : "[]";
    
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (error) {
    console.error("Error generating food recommendations:", error);
    return [];
  }
};

const generateReviewSummary = async (restaurant) => {
  const {
    name = "This restaurant",
    ratings = 0,
    numOfReviews = 0,
    isVeg = false,
    address = "",
    reviews = [],
  } = restaurant;

  const { positiveHits, negativeHits, mentions: reviewMentions } =
    analyzeReviewComments(reviews);

  const sentimentScore =
    ratings + positiveHits * 0.05 - negativeHits * 0.15;

  const reviewSentiment = getSentimentLabel(sentimentScore);

  // Get AI-powered summary
  const aiSummary = await generateAISummary(restaurant);

  // Get food recommendations
  const foodRecommendations = await generateFoodRecommendations(restaurant);

  // Fallback summary bullets if AI fails
  const reviewSummaryBullets = aiSummary ? [aiSummary] : [
    `${name} holds a ${ratings}/5 rating from ${numOfReviews} customer reviews.`,
    numOfReviews >= 500
      ? "One of the most reviewed spots — strong crowd favourite."
      : numOfReviews >= 200
        ? "Steady repeat customers and solid word-of-mouth."
        : "Growing local favourite with loyal regulars.",
    isVeg
      ? "Pure veg menu — great for vegetarian diners."
      : "Mixed menu with popular non-veg specials.",
  ];

  const cuisineTags = detectCuisineTags(name);
  const reviewTopMentions = [
    ...new Set([...cuisineTags, ...reviewMentions]),
  ].slice(0, 6);

  return {
    reviewSentiment,
    reviewSummaryBullets: reviewSummaryBullets.slice(0, 5),
    reviewTopMentions,
    aiSummary: aiSummary || null,
    foodRecommendations: foodRecommendations || [],
  };
};

module.exports = {
  generateReviewSummary,
  generateAISummary,
  generateFoodRecommendations,
};
