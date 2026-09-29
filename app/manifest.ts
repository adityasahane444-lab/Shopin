import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shopin",
    short_name: "Shopin",
    description: "Shop smart. Live better.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7fb",
    theme_color: "#6d35d9",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
