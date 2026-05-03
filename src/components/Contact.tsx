"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send, Copy, Check, Instagram, Loader2, Calendar, Mountain } from "lucide-react";
import { useState, FormEvent } from "react";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SectionHeader } from "./ui/SectionHeader";

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
            const response = await fetch("https://formsubmit.co/ajax/9d64015e0bad35be133b67c8bf0227a8", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                alert("Oops! There was a problem submitting your form. Please try again or email me directly.");
            }
        } catch (error) {
            alert("Oops! There was a problem submitting your form");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-24 relative px-6 md:px-12 max-w-7xl mx-auto">
            <SectionHeader title="Let's Connect" watermark="CONTACT" alignment="left" />

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
                            {/* FormSubmit Configuration */}
                            <input type="hidden" name="_subject" value="New Contact Form Submission!" />
                            <input type="hidden" name="_template" value="table" />
                            <input type="hidden" name="_captcha" value="false" />
                            <input type="text" name="_honey" style={{ display: 'none' }} />

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
                                    placeholder="What's your name?"
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
                                    placeholder="Where can I send my reply?"
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
                                    placeholder="Tell me about your next big idea, or just say hi..."
                                />
                            </div>

                            <MagneticWrapper strength={10}>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                                <a
                                    href="https://calendar.app.google/tSrCZHMnpHruxpPi7" // Replace with your actual Google Calendar Appointment Link
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all active:scale-95 cursor-pointer w-full justify-center"
                                >
                                    <Calendar className="text-emerald-400" size={20} />
                                    <span className="text-slate-300 font-medium group-hover:text-white transition-colors">Book a 30min Meeting</span>
                                </a>
                            </MagneticWrapper>
                        </div>

                        <div className="flex items-center gap-4">
                            <MagneticWrapper strength={20}>
                                <button
                                    onClick={handleCopy}
                                    className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all active:scale-95 cursor-pointer w-full"
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

                        <div className="flex gap-4 flex-wrap">
                            <MagneticWrapper strength={20}>
                                <a
                                    href="https://www.salesforce.com/trailblazer/kevinsuvagiya"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-all block cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="13.5 11.5 73 73" fill="currentColor">
                                        <g>
                                            <polygon points="32.7,63.8 29.5,67.5 35.9,67.5" />
                                            <polygon points="35.7,71.4 42.1,71.4 38.9,67.7" />
                                            <polygon points="61.3,68.8 64.5,65.1 67.7,68.8" />
                                            <g>
                                                <path d="M50.9,20.2c-0.5-0.3-1.2-0.3-1.7,0C31.3,27.8,19.8,45.5,20.1,65v4.3c0,0.7,0.3,1.3,0.9,1.7
                                                    c8.6,5.7,18.8,8.9,29.1,9h1h0.1c9.9-0.4,19.6-3.4,27.8-9c0.5-0.4,0.9-1,0.9-1.7V65C80.4,45.5,68.9,27.8,50.9,20.2z M34.7,36
                                                    c7.3-8.6,15.4-11.5,15.4-11.5c1.7,0.8,21.2,8.4,25.2,33h-5.1l-9.8-14.1c-0.7-0.9-2-1.2-3-0.5c-0.3,0.1-0.4,0.4-0.5,0.5L54.4,47
                                                    l-6.9-9.9c-0.7-0.9-2-1.2-3-0.5c-0.3,0.1-0.4,0.4-0.5,0.5L30.1,57.4L25,57.6C26.5,48.2,30.4,41.2,34.7,36z M65,57.6h-5.9h-6.8
                                                    l3.3-4.7l3-4.4L65,57.6z M47,43.6L47,43.6L47,43.6l5,7.2l-4.7,6.7h-1.3H35.2l5.1-7.6l5.4-8l0,0L47,43.6z M51.8,72.6L51.8,72.6
                                                    L50,75.8c-3.7,0-7.1-0.5-11-1.4l0,0c-5.1-1.3-10.1-3.4-14.5-6.1v-3.1c0-1,0-2.1,0.1-3.3H34h12.7c-1.7,2.6-0.9,6.1,1.8,7.7
                                                    c0.3,0.1,0.5,0.3,0.7,0.4l2,0.9C51.8,71.1,52,71.9,51.8,72.6z M75.8,68.1c-3.3,2-6.7,3.7-10.2,4.8c0,0-0.7,0.3-0.9,0.3
                                                    c-2,0.7-4,1.2-6.1,1.6c-1.2,0.3-2.4,0.4-3.5,0.5l0.4-0.7c1.6-2.7,0.7-6.1-2.1-7.7c-0.1-0.1-0.4-0.1-0.5-0.3l-2-0.9
                                                    c-0.7-0.3-1-1-0.7-1.7c0-0.1,0.1-0.3,0.1-0.3l1.8-2.1h3.9h19.6c0,1,0.1,2.1,0.1,3.3V68.1z"/>
                                            </g>
                                        </g>
                                    </svg>
                                </a>
                            </MagneticWrapper>

                            <MagneticWrapper strength={20}>
                                <a
                                    href="https://www.linkedin.com/in/kevin-suvagiya/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-600/50 hover:bg-slate-800 text-slate-400 hover:text-blue-600 transition-all block cursor-pointer"
                                >
                                    <Linkedin size={24} />
                                </a>
                            </MagneticWrapper>

                            <MagneticWrapper strength={20}>
                                <a
                                    href="https://kevinsuvagiya.medium.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-500/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all block cursor-pointer"
                                >
                                    {/* Medium Icon */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                                    </svg>
                                </a>
                            </MagneticWrapper>

                            <MagneticWrapper strength={20}>
                                <a
                                    href="https://www.instagram.com/kevin_suvagiya02/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800 text-slate-400 hover:text-pink-400 transition-all block cursor-pointer"
                                >
                                    <Instagram size={24} />
                                </a>
                            </MagneticWrapper>

                            <MagneticWrapper strength={20}>
                                <a
                                    href="https://github.com/KEVINSUVAGIYA"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all block cursor-pointer"
                                >
                                    <Github size={24} />
                                </a>
                            </MagneticWrapper>

                            <MagneticWrapper strength={20}>
                                <a
                                    href="https://x.com/kevin__suvagiya"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-500/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all block cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                    </svg>
                                </a>
                            </MagneticWrapper>
                        </div>
                    </div>
                </motion.div>
            </div>


        </section>
    );
};
