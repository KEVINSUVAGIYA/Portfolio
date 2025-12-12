"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send, Copy, Check, Instagram, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";

export const Contact = () => {
    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("kevinsuvagiya11@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("https://formspree.io/f/mzznjynk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                alert("Oops! There was a problem submitting your form");
            }
        } catch (error) {
            alert("Oops! There was a problem submitting your form");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-24 relative px-6 md:px-12 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Let's Connect
                </h2>
                <div className="h-1 w-20 bg-sky-500 rounded-full" />
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:justify-between items-start gap-12">
                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-slate-900 p-8 rounded-2xl border border-slate-800 relative overflow-hidden w-full lg:max-w-xl"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-sky-500/20 blur-3xl rounded-full pointer-events-none" />

                    {isSuccess ? (
                        <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                <Check className="text-emerald-500" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                            <p className="text-slate-400 max-w-xs">
                                Thanks for reaching out. I'll get back to you as soon as possible.
                            </p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="mt-4 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                                    placeholder="What Should I Call You?"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                                    placeholder="Email to get back to you!"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            <MagneticWrapper strength={10}>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </MagneticWrapper>
                        </form>
                    )}
                </motion.div>

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h3 className="text-2xl font-semibold text-slate-200 mb-6">
                        Get in Touch
                    </h3>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <MagneticWrapper strength={20}>
                                <button
                                    onClick={handleCopy}
                                    className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all active:scale-95"
                                >
                                    <Mail className="text-sky-400" size={20} />
                                    <span className="text-slate-300 font-medium">kevinsuvagiya11@gmail.com</span>
                                    {copied ? (
                                        <Check size={16} className="text-emerald-400" />
                                    ) : (
                                        <Copy size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                                    )}
                                </button>
                            </MagneticWrapper>
                        </div>

                        <div className="flex gap-4">
                            <MagneticWrapper strength={20}>
                                <a
                                    href="https://github.com/KEVINSUVAGIYA"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all block"
                                >
                                    <Github size={24} />
                                </a>
                            </MagneticWrapper>

                            <MagneticWrapper strength={20}>
                                <a
                                    href="https://www.linkedin.com/in/kevin-suvagiya/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all block"
                                >
                                    <Linkedin size={24} />
                                </a>
                            </MagneticWrapper>

                            <MagneticWrapper strength={20}>
                                <a
                                    href="https://www.instagram.com/kevin_suvagiya02/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800 text-slate-400 hover:text-pink-400 transition-all block"
                                >
                                    <Instagram size={24} />
                                </a>
                            </MagneticWrapper>
                        </div>
                    </div>
                </motion.div>
            </div>


        </section>
    );
};
