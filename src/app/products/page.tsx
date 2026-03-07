"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductsRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/#products");
    }, [router]);

    return (
        <div className="flex min-h-[50vh] items-center justify-center text-slate-400">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin"></div>
                <p className="text-sm font-medium">Redirecting to Portfolio...</p>
            </div>
        </div>
    );
}
