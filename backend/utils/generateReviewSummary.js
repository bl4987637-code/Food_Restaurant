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

const generateReviewSummary = (restaurant) => {
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

  const reviewSummaryBullets = [
    `${name} holds a ${ratings}/5 rating from ${numOfReviews} customer reviews.`,
    numOfReviews >= 500
      ? "One of the most reviewed spots — strong crowd favourite."
      : numOfReviews >= 200
        ? "Steady repeat customers and solid word-of-mouth."
        : "Growing local favourite with loyal regulars.",
    isVeg
      ? "Pure veg menu — great for vegetarian diners."
      : "Mixed menu with popular non-veg specials.",
    ratings >= 4.5
      ? "Guests consistently praise taste and overall experience."
      : ratings >= 4.0
        ? "Generally well-liked with strong overall feedback."
        : "Mixed feedback — some dishes stand out more than others.",
  ];

  if (reviews.length > 0) {
    const avgReviewRating =
      reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

    reviewSummaryBullets.push(
      `Recent reviewers average ${avgReviewRating.toFixed(1)}/5 across ${reviews.length} written reviews.`
    );

    const highlight = reviews.find((r) => (r.rating || 0) >= 4);
    if (highlight?.Comment) {
      reviewSummaryBullets.push(`"${highlight.Comment}" — ${highlight.name}`);
    }
  }

  if (address) {
    reviewSummaryBullets.push(`Conveniently located at ${address}.`);
  }

  const cuisineTags = detectCuisineTags(name);
  const reviewTopMentions = [
    ...new Set([...cuisineTags, ...reviewMentions]),
  ].slice(0, 6);

  return {
    reviewSentiment,
    reviewSummaryBullets: reviewSummaryBullets.slice(0, 5),
    reviewTopMentions,
  };
};

module.exports = generateReviewSummary;
