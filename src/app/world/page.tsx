// import { Scene } from "@/components/World/Scene";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function WorldPage() {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-white flex flex-col items-center justify-center">

            <div className="absolute top-5 left-5 z-50">
                <Link href="/#playgrounds" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition-colors border border-white/10 bg-black/20 backdrop-blur-md">
                    <ArrowLeft size={15} /> Back
                </Link>
            </div>

            <div className="flex flex-col items-center text-center max-w-lg p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-lg">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-fuchsia-400/20 flex items-center justify-center mb-6 border border-fuchsia-400/30">
                    <Sparkles size={28} className="text-fuchsia-300" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300 mb-4">
                    Spirit World
                </h1>
                <p className="text-slate-400 leading-relaxed mb-6">
                    A gamified 3D experience is currently being forged in the universe. Check back soon.
                </p>
                <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-widest text-white/60 uppercase">
                    Coming Soon
                </div>
            </div>

            {/* <Scene /> */}
        </div>
    );
};
