import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";


export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return [
        {
            url: SITE_URL,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 1,
        },
        // Uncomment these when the pages are pushed live:
        // {
        //     url: `${SITE_URL}/world`,
        //     lastModified: now,
        //     changeFrequency: "monthly",
        //     priority: 0.7,
        // },
        // {
        //     url: `${SITE_URL}/playground/lanterns`,
        //     lastModified: now,
        //     changeFrequency: "monthly",
        //     priority: 0.5,
        // },
        // {
        //     url: `${SITE_URL}/playground/ripples`,
        //     lastModified: now,
        //     changeFrequency: "monthly",
        //     priority: 0.5,
        // },
        // {
        //     url: `${SITE_URL}/playground/flight`,
        //     lastModified: now,
        //     changeFrequency: "monthly",
        //     priority: 0.5,
        // },
    ];
}
