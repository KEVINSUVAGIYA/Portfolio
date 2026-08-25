import type { Metadata } from "next";
import { HeeraHisaabContent } from "./HeeraHisaabPage";
import { BASE_PATH } from "@/lib/constants";

export const metadata: Metadata = {
    title: "HeeraHisaab — Intelligent Diamond Tracking",
    description: "A premium PWA for diamond workers to log daily work, track earnings, and monitor monthly progress — in English & Gujarati.",
    keywords: ["HeeraHisaab", "Diamond Tracking", "Diamond Industry", "Diamond Worker App", "PWA", "Gujarati App"],
    openGraph: {
        title: "HeeraHisaab — Intelligent Diamond Tracking",
        description: "A premium PWA for diamond workers to log daily work, track earnings, and monitor monthly progress.",
        url: "/products/heerahisaab",
        type: "website",
        images: [
            {
                url: `${BASE_PATH}/products/heerahisaab-logo.png`,
                alt: "HeeraHisaab Logo",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "HeeraHisaab — Intelligent Diamond Tracking",
        description: "A premium PWA for diamond workers to log daily work, track earnings, and monitor monthly progress.",
        images: [`${BASE_PATH}/products/heerahisaab-logo.png`],
    },
};

export default function page() {
    return <HeeraHisaabContent />;
}
