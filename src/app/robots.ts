import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Gera robots.txt a partir de SITE_URL (Sitemap sempre absoluto). Bloqueia
// rotas privadas/transacionais da indexação.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
