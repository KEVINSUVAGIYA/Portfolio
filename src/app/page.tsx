import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Playground } from "@/components/Playground";
import { Tools } from "@/components/Tools";
import { Skills } from "@/components/Skills";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Certifications } from "@/components/Certifications";
import { SocialHub } from "@/components/SocialHub";
import { Products } from "@/components/Products";
import { Stats } from "@/components/Stats";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/constants";

import { OrbitalNav } from "@/components/navigation/OrbitalNav";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kevin Suvagiya Portfolio",
    "url": SITE_URL,
    "hasPart": [
      {
        "@type": "WebPage",
        "name": "Products",
        "url": `${SITE_URL}/#products`,
        "description": "Premium extensions and applications built by Kevin Suvagiya."
      },
      {
        "@type": "WebPage",
        "name": "Playgrounds",
        "url": `${SITE_URL}/#playgrounds`,
        "description": "Interactive web experiments and games."
      },
      {
        "@type": "WebPage",
        "name": "Tools",
        "url": `${SITE_URL}/#tools`,
        "description": "A collection of free developer tools and utilities."
      },
      {
        "@type": "WebPage",
        "name": "About Me",
        "url": `${SITE_URL}/#about`,
        "description": "Learn more about Kevin Suvagiya, Salesforce Developer."
      },
      {
        "@type": "WebPage",
        "name": "Contact Me",
        "url": `${SITE_URL}/#contact`,
        "description": "Get in touch with Kevin Suvagiya."
      }
    ]
  };

  return (
    <main className="min-h-screen relative">
      <OrbitalNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div id="hero">
        <Hero />
      </div>
      <Certifications />
      <Stats />
      <Products />
      <Projects />
      <Playground />
      <Tools />
      <Experience />
      <Skills />
      <About />
      <SocialHub />
      <Contact />
      <Footer />
    </main>
  );
}
