import type { MetadataRoute } from "next";
import { community } from "@/data/community";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: community.name,
    short_name: community.shortName,
    description: "Meet the developers of Tanzania and join the TDC WhatsApp group.",
    start_url: "/",
    display: "standalone",
    background_color: "#e8ebe4",
    theme_color: "#e8ebe4",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
