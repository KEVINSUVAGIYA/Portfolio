import { Home, Award, BarChart3, Package, Briefcase, Gamepad2, Hammer, History, Lightbulb, User, Share2, Mail } from "lucide-react";

export const sections = [
    { id: "hero", label: "Home", icon: Home },
    { id: "products", label: "Products", icon: Package },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "playgrounds", label: "Playgrounds", icon: Gamepad2 },
    { id: "tools", label: "Tools", icon: Hammer },
    { id: "experience", label: "Experience", icon: History },
    { id: "skills", label: "Skills", icon: Lightbulb },
    { id: "about", label: "About", icon: User },
    { id: "contact", label: "Contact", icon: Mail },
];

export const sectionIds = sections.map(s => s.id);
