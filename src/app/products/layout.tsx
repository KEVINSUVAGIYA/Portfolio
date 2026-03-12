import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScrollToTop } from "@/components/ScrollToTop";

export const metadata: Metadata = {
    robots: { index: true, follow: true },
};

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950/70 text-slate-200">
            <ScrollToTop />

            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center">
                    <Link
                        href="/#products"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Portfolio
                    </Link>
                </div>
            </nav>

            {/* Page Content */}
            <main>{children}</main>
        </div>
    );
}
