"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Chrome, Globe, ArrowUpRight } from "lucide-react";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { BASE_PATH } from "@/lib/constants";

const products = [
    {
        name: "SipSync",
        tagline: "Water Reminder & Hydration Tracker",
        description:
            "A beautiful Chrome Extension that reminds you to stay hydrated with smart notifications, daily tracking, and goal celebrations.",
        logo: `${BASE_PATH}/products/sipsync-logo.png`,
        href: "/products/sipsync",
        platform: "Chrome Extension",
        platformIcon: Chrome,
        accentColor: "#51BFF2",
        gradient: "from-[#51BFF2]/20 to-[#3291D9]/20",
        borderHover: "hover:border-[#51BFF2]/50",
    },
    {
        name: "HeeraHisaab",
        tagline: "Intelligent Diamond Tracking",
        description:
            "A premium PWA for diamond workers to log daily work, track earnings, and monitor monthly progress — in English & Gujarati.",
        logo: `${BASE_PATH}/products/heerahisaab-logo.png`,
        href: "/products/heerahisaab",
        platform: "Web App",
        platformIcon: Globe,
        accentColor: "#3b82f6",
        gradient: "from-[#3b82f6]/20 to-[#2563eb]/20",
        borderHover: "hover:border-[#3b82f6]/50",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
    },
};

export const Products = () => {
    return (
        <section id="products" className="py-24 relative px-6 md:px-12 max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Products
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                    I like building solutions for problems I face myself — here&apos;s what came out of that curiosity.
                </p>
                <div className="h-1 w-20 bg-sky-500 rounded-full mt-6" />
            </motion.div>

            {/* Product Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                {products.map((product) => {
                    const PlatformIcon = product.platformIcon;
                    return (
                        <motion.div key={product.name} variants={cardVariants}>
                            <MagneticWrapper strength={12}>
                                <Link
                                    href={product.href}
                                    className={`group relative flex flex-col p-8 rounded-2xl bg-slate-900/70 backdrop-blur-sm border border-slate-800 ${product.borderHover} transition-all duration-500 cursor-pointer overflow-hidden h-full hover:scale-[1.02] hover:shadow-2xl`}
                                    style={{
                                        boxShadow: `0 0 0px ${product.accentColor}00`,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = `0 8px 40px ${product.accentColor}25`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = `0 0 0px ${product.accentColor}00`;
                                    }}
                                >
                                    {/* Gradient overlay */}
                                    <div
                                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                    />

                                    {/* Top-right glow orb */}
                                    <div
                                        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700"
                                        style={{ backgroundColor: product.accentColor }}
                                    />

                                    {/* Bottom-left subtle glow */}
                                    <div
                                        className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-all duration-700"
                                        style={{ backgroundColor: product.accentColor }}
                                    />

                                    {/* Light sweep on hover */}
                                    <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div
                                            className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Header row: logo + platform badge */}
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700 flex-shrink-0 group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 group-hover:shadow-lg"
                                                style={{
                                                    boxShadow: `0 0 0px ${product.accentColor}00`,
                                                }}
                                            >
                                                <Image
                                                    src={product.logo}
                                                    alt={`${product.name} logo`}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border group-hover:scale-105 transition-transform duration-300"
                                                style={{
                                                    color: product.accentColor,
                                                    borderColor: `${product.accentColor}33`,
                                                    backgroundColor: `${product.accentColor}11`,
                                                }}
                                            >
                                                <PlatformIcon size={12} />
                                                {product.platform}
                                            </span>
                                        </div>

                                        {/* Name + tagline */}
                                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform duration-300">
                                            {product.name}
                                        </h3>
                                        <p
                                            className="text-sm font-medium mb-4"
                                            style={{ color: product.accentColor }}
                                        >
                                            {product.tagline}
                                        </p>

                                        {/* Description */}
                                        <p className="text-slate-400 leading-relaxed mb-8 flex-1 group-hover:text-slate-300 transition-colors duration-300">
                                            {product.description}
                                        </p>

                                        {/* CTA */}
                                        <div
                                            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg w-fit transition-all duration-300 group-hover:gap-3"
                                            style={{
                                                color: product.accentColor,
                                                backgroundColor: `${product.accentColor}15`,
                                                border: `1px solid ${product.accentColor}30`,
                                            }}
                                        >
                                            Check It Out!
                                            <ArrowUpRight
                                                size={16}
                                                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </MagneticWrapper>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};
