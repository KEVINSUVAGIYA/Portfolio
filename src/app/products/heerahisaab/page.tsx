import type { Metadata } from "next";
import { HeeraHisaabContent } from "./HeeraHisaabPage";

export const metadata: Metadata = {
    title: "HeeraHisaab — Intelligent Diamond Tracking",
    description: "A premium PWA for diamond workers to log daily work, track earnings, and monitor monthly progress — in English & Gujarati.",
    keywords: ["HeeraHisaab", "Diamond Tracking", "Diamond Industry", "Diamond Worker App", "PWA", "Gujarati App"],
    openGraph: {
        title: "HeeraHisaab — Intelligent Diamond Tracking",
        description: "A premium PWA for diamond workers to log daily work, track earnings, and monitor monthly progress.",
        type: "website",
    }
};

export default function page() {
    return <HeeraHisaabContent />;
}
