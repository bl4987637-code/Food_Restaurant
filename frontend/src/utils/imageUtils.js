export const RESTAURANT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop";

export const FOOD_PLACEHOLDER =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";

export const getImageUrl = (images, fallback) => {
  const url = images?.find((img) => img?.url)?.url;
  return url || fallback;
};
