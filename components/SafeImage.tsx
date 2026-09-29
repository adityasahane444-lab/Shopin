"use client";

import { useEffect, useState } from "react";

const fallbacks: Record<string, string> = {
  Mobiles: "/products/phone-product.svg",
  Electronics: "/products/gaming-keyboard-product.svg",
  Fashion: "/products/shirt-product.svg",
  Home: "/products/dining-table-product.svg",
  Beauty: "/products/serum-product.svg",
  Grocery: "/products/almonds-product.svg",
  Sports: "/products/running-shoes-product.svg",
  Appliances: "/products/washing-product.svg",
  Kids: "/products/kids-product.svg",
  Books: "/products/book-product.svg",
  "Two Wheelers": "/products/two-wheeler-product.svg",
  More: "/products/generic-product.svg",
};

const titleFallbacks: Array<[string[], string]> = [
  [["iphone"], "/products/phone-product.svg"],
  [["galaxy", "smartphone", "phone", "pixel", "oneplus", "oppo", "vivo", "redmi", "poco", "realme", "motorola", "infinix", "xiaomi"], "/products/phone-product.svg"],
  [["laptop", "macbook", "notebook", "chromebook"], "/products/laptop-product.svg"],
  [["keyboard"], "/products/gaming-keyboard-product.svg"],
  [["mouse"], "/products/mouse-product.svg"],
  [["headphone", "headset", "earbud", "earphone", "airpods"], "/products/headphones-product.svg"],
  [["camera", "nikon", "canon", "dslr", "mirrorless"], "/products/camera-product.svg"],
  [["shirt", "t-shirt", "kurta", "kurti", "saree", "dress", "jeans"], "/products/shirt-product.svg"],
  [["running shoe", "sports shoe", "sneaker", "shoe"], "/products/running-shoes-product.svg"],
  [["air fryer"], "/products/air-fryer-product.svg"],
  [["washing machine"], "/products/washing-product.svg"],
  [["air conditioner", "split ac", "ac 1.5", "ac"], "/products/ac-product.svg"],
  [["dining table", "sofa", "furniture", "chair", "table", "bed", "mattress"], "/products/dining-table-product.svg"],
  [["serum", "shampoo", "cosmetic", "makeup", "beauty"], "/products/serum-product.svg"],
  [["almond", "rice", "oil", "grocery", "snack", "tea", "coffee"], "/products/almonds-product.svg"],
  [["backpack", "bag"], "/products/backpack-product.svg"],
  [["toy", "kids", "baby", "doll"], "/products/kids-product.svg"],
  [["book", "novel", "textbook", "comics"], "/products/book-product.svg"],
  [["bike", "scooter", "motorcycle", "scooty"], "/products/two-wheeler-product.svg"],
];

function getFallback(category: string, alt: string) {
  const haystack = alt.toLowerCase();
  for (const [keywords, src] of titleFallbacks) {
    if (keywords.some((keyword) => haystack.includes(keyword))) return src;
  }
  return fallbacks[category] || fallbacks.More;
}

export default function SafeImage({
  src,
  alt,
  category = "More",
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { category?: string }) {
  const [failed, setFailed] = useState(false);
  const fallback = getFallback(category, String(alt || ""));
  const normalizedSrc = typeof src === "string"
    ? src
        .replace(/^\/original-assets\/img\//, "/original-assets/")
        .replace(/^\.\.\/img\//, "/original-assets/")
        .replace(/^\.\.\//, "/original-assets/")
    : src;
  const source = failed ? fallback : normalizedSrc;

  useEffect(() => {
    setFailed(false);
  }, [normalizedSrc]);

  return (
    <img
      {...props}
      src={source}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
