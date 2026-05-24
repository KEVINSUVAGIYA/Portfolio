import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

function getDirectories(basePath: string) {
    try {
        const fullPath = path.join(process.cwd(), "src/app", basePath);
        return fs.readdirSync(fullPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('[') && !dirent.name.startsWith('('))
            .map(dirent => `/${basePath}/${dirent.name}`);
    } catch {
        return [];
    }
}

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    
    // Core static routes
    let routes = [
        "",
        "/world",
        "/products/sipsync/guide",
        "/products/sipsync/faq",
        "/products/sipsync/privacy",
        "/products/heerahisaab/guide",
        "/products/heerahisaab/faq",
        "/products/heerahisaab/privacy",
        "/products/salesforcesmartkit/guide",
        "/products/salesforcesmartkit/faq",
        "/products/salesforcesmartkit/privacy",
    ];

    // Dynamically inject all products, tools, and playgrounds
    routes = [
        ...routes,
        ...getDirectories("products"),
        ...getDirectories("tools"),
        ...getDirectories("playground"),
    ];

    return routes.map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: now,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : route.includes("/products/") && !route.includes("/", 10) ? 0.8 : 0.5,
    }));
}
