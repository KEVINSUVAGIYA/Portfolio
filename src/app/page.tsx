import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Certifications } from "@/components/Certifications";

import { Stats } from "@/components/Stats";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Certifications />
      <Stats />
      <Projects />
      <Experience />
      <Skills />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
