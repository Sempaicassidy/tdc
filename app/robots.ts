import type { MetadataRoute } from "next";
import { community } from "@/data/community";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${community.url}/sitemap.xml`,
  };
}
