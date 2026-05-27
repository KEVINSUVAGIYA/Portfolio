import { useState, useEffect } from "react";

export function useActiveSection(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState(sectionIds[0] || "");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                let found = false;
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                        found = true;
                    }
                });
            },
            { rootMargin: "-30% 0px -70% 0px" }
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sectionIds.join(",")]);

    return activeSection;
}
