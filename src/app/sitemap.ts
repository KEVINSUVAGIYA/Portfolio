import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";


export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const routes = [
        "",
        "/products/sipsync",
        "/products/sipsync/guide",
        "/products/sipsync/faq",
        "/products/sipsync/privacy",
        "/products/heerahisaab",
        "/products/heerahisaab/guide",
        "/products/heerahisaab/faq",
        "/products/heerahisaab/privacy",
        "/world",
        "/playground/lanterns",
        "/playground/ripples",
        "/playground/flight",
        "/tools",
        "/tools/chat",
        "/tools/notes",
        "/tools/poll",
        "/tools/timer",
        "/tools/timezone",
        "/tools/qr",
        "/tools/password",
        "/tools/json",
    ];

    return routes.map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: now,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : route.includes("/products/") && !route.includes("/", 10) ? 0.8 : 0.5,
    }));
}
