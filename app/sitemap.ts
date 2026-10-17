import type { MetadataRoute } from "next";
import { community } from "@/data/community";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: community.url,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
	];
}
