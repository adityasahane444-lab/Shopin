export const SHOP_CATEGORIES = [
  "Mobiles",
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Grocery",
  "Sports",
  "Appliances",
  "Kids",
  "Books",
  "Two Wheelers",
  "More",
] as const;

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export const CATEGORY_ALIASES: Record<string, ShopCategory | "More"> = {
  mobile: "Mobiles",
  mobiles: "Mobiles",
  smartphone: "Mobiles",
  smartphones: "Mobiles",
  tablet: "Mobiles",
  tablets: "Mobiles",
  fashion: "Fashion",
  clothing: "Fashion",
  apparel: "Fashion",
  footwear: "Fashion",
  shoes: "Fashion",
  electronics: "Electronics",
  "electronics/laptop": "Electronics",
  "electronics/earphones": "Electronics",
  "electronics-earphones": "Electronics",
  electronic: "Electronics",
  laptop: "Electronics",
  laptops: "Electronics",
  computer: "Electronics",
  computers: "Electronics",
  desktop: "Electronics",
  accessory: "Electronics",
  accessories: "Electronics",
  audio: "Electronics",
  earphone: "Electronics",
  earphones: "Electronics",
  headphone: "Electronics",
  headphones: "Electronics",
  camera: "Electronics",
  cameras: "Electronics",
  tv: "Appliances",
  television: "Appliances",
  "smart tv": "Appliances",
  monitor: "Electronics",
  printer: "Electronics",
  projector: "Electronics",
  keyboard: "Electronics",
  mouse: "Electronics",
  smartwatch: "Electronics",
  "smart watch": "Electronics",
  beauty: "Beauty",
  "beauty&toys": "Beauty",
  "beauty toys more": "Beauty",
  "beauty toys and more": "Beauty",
  cosmetics: "Beauty",
  cosmetic: "Beauty",
  grooming: "Beauty",
  personal: "Beauty",
  grocery: "Grocery",
  groceries: "Grocery",
  food: "Grocery",
  sports: "Sports",
  sport: "Sports",
  fitness: "Sports",
  appliance: "Appliances",
  appliances: "Appliances",
  "appliances/tv": "Appliances",
  "appliances/washing": "Appliances",
  "home appliance": "Appliances",
  "home appliances": "Appliances",
  home: "Home",
  "home&furniture": "Home",
  "home&kitchen": "Home",
  "home & kitchen": "Home",
  kitchen: "Home",
  furniture: "Home",
  decor: "Home",
  "home decor": "Home",
  kid: "Kids",
  "kids toys": "Kids",
  kids: "Kids",
  toy: "Kids",
  toys: "Kids",
  books: "Books",
  book: "Books",
  "fashion-men": "Fashion",
  "fashion-women": "Fashion",
  "twowheeler": "Two Wheelers",
  "two wheelers": "Two Wheelers",
  "two wheeler": "Two Wheelers",
  "two-wheelers": "Two Wheelers",
  "two-wheeler": "Two Wheelers",
  motorcycle: "Two Wheelers",
  motorcycles: "Two Wheelers",
  bike: "Two Wheelers",
  bikes: "Two Wheelers",
  scooter: "Two Wheelers",
  scooters: "Two Wheelers",
};

const KEYWORD_GROUPS: Array<[ShopCategory, string[]]> = [
  ["Mobiles", ["iphone", "phone", "smartphone", "galaxy", "pixel", "redmi", "poco", "oneplus", "oppo", "vivo", "realme", "motorola", "infinix", "xiaomi"]],
  ["Fashion", ["shirt", "t-shirt", "kurta", "kurti", "saree", "jeans", "trouser", "track pant", "jacket", "blazer", "dress", "gown", "salwar", "shoes", "sneaker", "sandals", "heels", "wallet", "belt", "sunglasses"]],
  ["Beauty", ["lipstick", "foundation", "concealer", "mascara", "eyeliner", "makeup", "serum", "shampoo", "conditioner", "skincare", "face wash", "perfume", "grooming"]],
  ["Grocery", ["rice", "atta", "flour", "oil", "dal", "lentil", "biscuit", "snack", "chocolate", "juice", "coffee", "tea", "milk", "cheese", "egg", "bread", "pasta", "spice", "masala", "grocery"]],
  ["Sports", ["cricket", "football", "badminton", "tennis", "running", "gym", "fitness", "yoga", "sports"]],
  ["Appliances", ["air conditioner", " air conditioner", "split ac", "washing machine", "refrigerator", "fridge", "microwave", "oven", "air fryer", "cooler", "vacuum cleaner", "appliance"]],
  ["Home", ["sofa", "dining table", "chair", "table", "bed", "mattress", "furniture", "curtain", "carpet", "rug", "lamp", "home decor", "kitchen"]],
  ["Kids", ["kids", "baby", "toy", "toys", "doll", "puzzle", "building blocks"]],
  ["Books", ["book", "novel", "textbook", "comics"]],
  ["Two Wheelers", ["motorcycle", "bike", "scooter", "scooty", "two wheeler"]],
  ["Electronics", ["laptop", "macbook", "computer", "desktop", "monitor", "keyboard", "mouse", "printer", "projector", "camera", "dslr", "mirrorless", "earbud", "earphone", "headphone", "speaker", "tablet", "charger", "power bank"]],
];

export function normalizeCategory(raw = "", title = ""): ShopCategory | "More" {
  const rawKey = raw.trim().toLowerCase();
  const titleKey = title.toLowerCase();
  const normalizedKey = rawKey
    .replace(/&/g, " and ")
    .replace(/[,_\-\/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // The original "Beauty, Toys & More" bucket contains two distinct Shopin
  // categories, so let the product name disambiguate it before accepting the
  // broad source-category mapping.
  if (
    rawKey.includes("beauty") &&
    (rawKey.includes("toy") || rawKey.includes("more"))
  ) {
    if (["toy", "toys", "kids", "baby", "doll", "puzzle", "building blocks"].some((x) => titleKey.includes(x))) return "Kids";
    return "Beauty";
  }

  const direct = CATEGORY_ALIASES[rawKey] || CATEGORY_ALIASES[normalizedKey];
  if (direct) return direct;

  // Strong title-based rules first: these prevent broad words such as
  // "watch" or "home" from putting a product into an unrelated section.
  const strongTitleRules: Array<[ShopCategory, string[]]> = [
    ["Mobiles", ["iphone", "smartphone", "mobile phone", "android phone", "galaxy phone", "pixel phone", "oneplus nord"]],
    ["Appliances", ["smart tv", "television", "washing machine", "refrigerator", "air conditioner", "air fryer", "microwave", "oven", "vacuum cleaner"]],
    ["Electronics", ["smartwatch", "smart watch", "earbuds", "earphone", "headphone", "laptop", "macbook", "keyboard", "mouse", "camera", "dslr", "projector"]],
    ["Kids", ["toy", "toys", "doll", "kids", "baby", "puzzle", "building blocks"]],
    ["Books", ["book", "novel", "textbook", "comics"]],
  ];
  for (const [category, keywords] of strongTitleRules) {
    if (keywords.some((keyword) => titleKey.includes(keyword))) return category;
  }

  const haystack = `${raw} ${title}`.toLowerCase().replace(/\s+/g, " ").trim();
  for (const [category, keywords] of KEYWORD_GROUPS) {
    if (keywords.some((keyword) => haystack.includes(keyword))) return category;
  }
  return "More";
}
