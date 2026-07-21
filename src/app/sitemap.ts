import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// URLs absolutas geradas de SITE_URL (evita <loc> relativo, inválido na spec).
// Só a home é pública/indexável; /admin e /api ficam fora.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
