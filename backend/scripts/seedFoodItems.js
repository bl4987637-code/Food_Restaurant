const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");
const fs = require("fs");
const path = require("path");

const Restaurant = require("../models/restaurant");
const Menu = require("../models/menu");
const FoodItem = require("../models/foodItem");

dotenv.config({ path: path.join(__dirname, "../config/config.env") });

const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1565958011703-44f9824ba187?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb4b07?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1482049016688-a7bd069990b6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1493770348161-369537ae4270?w=400&h=300&fit=crop",
];

const normalizeId = (value) => {
  if (value && value.$oid) return value.$oid;
  return value;
};

const isBlockedImageUrl = (url) => {
  if (!url || typeof url !== "string") return true;
  if (url.startsWith("data:")) return false;
  return (
    url.includes("zmtcdn.com") ||
    url.includes("archanaskitchen.com") ||
    url.includes("licious.in") ||
    url.includes("spicecravings.com") ||
    url.includes("madhuseverydayindian.com")
  );
};

const fixFoodImages = (images, index) => {
  const fallback = FOOD_IMAGES[index % FOOD_IMAGES.length];
  const first = images?.find((img) => img?.url);

  if (!first || isBlockedImageUrl(first.url)) {
    return [
      {
        public_id: first?.public_id || `food_${index}`,
        url: fallback,
      },
    ];
  }

  return [
    {
      public_id: first.public_id || `food_${index}`,
      url: first.url,
    },
  ];
};

const buildFoodToRestaurantMap = (menusData) => {
  const map = {};

  menusData.forEach((menuDoc) => {
    const restaurantId = normalizeId(menuDoc.restaurant);

    menuDoc.menu.forEach((category) => {
      category.items.forEach((itemId) => {
        map[normalizeId(itemId)] = restaurantId;
      });
    });
  });

  return map;
};

const seedDB = async () => {
  try {
    await connectDatabase();

    console.log("Clearing existing data...");
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    await FoodItem.deleteMany({});

    const restaurantsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/restaurants.json"), "utf-8")
    );

    const foodItemsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/foodItem.json"), "utf-8")
    );

    const menusData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/menus.json"), "utf-8")
    );

    const foodToRestaurant = buildFoodToRestaurantMap(menusData);
    const defaultRestaurantId = restaurantsData[0]._id;

    console.log(`Creating ${restaurantsData.length} restaurants...`);
    await Restaurant.insertMany(restaurantsData);

    console.log("Inserting food items...");
    let index = 0;
    for (let item of foodItemsData) {
      const itemId = item._id?.$oid || item._id;
      if (itemId) {
        item._id = itemId;
      } else {
        delete item._id;
      }

      if (item.createdAt && item.createdAt.$date) {
        item.createdAt = item.createdAt.$date;
      }

      item.restaurant = foodToRestaurant[itemId] || defaultRestaurantId;
      item.images = fixFoodImages(item.images, index);
      index += 1;

      await FoodItem.create(item);
    }

    console.log("Creating menus from JSON...");
    const menusToInsert = menusData.map((menuData) => ({
      _id: menuData._id?.$oid,
      restaurant: normalizeId(menuData.restaurant),
      menu: menuData.menu.map((category) => ({
        category: category.category,
        items: category.items.map(normalizeId),
      })),
    }));

    await Menu.insertMany(menusToInsert);

    const restaurantCount = await Restaurant.countDocuments();
    console.log(`Database seeded successfully with ${restaurantCount} restaurants!`);
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
