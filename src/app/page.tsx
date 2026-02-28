"use client";

import { useState, useEffect } from "react";
import PortalScene from "../app/components/portalscene";
import { FaGithub, FaTwitter, FaInstagram, FaEnvelope, FaRocket } from "react-icons/fa";

type Project = {
  title: string;
  description: string;
  url: string;
  tech: string[];
  image?: string;
};

type SocialKey = keyof typeof iconMap;

const iconMap = {
  github: <FaGithub />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  mail: <FaEnvelope />,
  warpcast: <FaRocket />,
};

const studioData = {
  logo: "https://i.ibb.co/thLkGz7/Vale-Foto.png", // Placeholder - Vale actualizará
  title: "TAAK STUDIO",
  subtitle: "Desarrollo Web · Diseño · Experiencias Digitales",
  description: "Creamos experiencias web únicas que combinan diseño elegante con tecnología de vanguardia.",
  
  // Placeholder projects (Vale actualizará con la lista real)
  projects: [
    {
      title: "Proyecto 1",
      description: "Descripción del proyecto aquí",
      url: "#",
      tech: ["Next.js", "React", "Tailwind"],
    },
    {
      title: "Proyecto 2",
      description: "Descripción del proyecto aquí",
      url: "#",
      tech: ["Three.js", "TypeScript"],
    },
    {
      title: "Proyecto 3",
      description: "Descripción del proyecto aquí",
      url: "#",
      tech: ["React", "Framer Motion"],
    },
  ] as Project[],
  
  socials: [
    { title: "github", url: "https://github.com/TA-AK-STUDIO" },
    { title: "twitter", url: "https://twitter.com/TAAKStudio" },
    { title: "instagram", url: "https://instagram.com/taakstudio" },
    { title: "mail", url: "mailto:hello@taakstudio.com" },
  ],
};

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 500;
      const progress = Math.min(window.scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen font-sans bg-black text-white">
      {/* Escena espacial de fondo */}
      <PortalScene zoom={scrollProgress} />

      {/* Overlay de cabina (fades out on scroll) */}
      <div
        className="fixed top-0 left-0 w-full h-full z-5 transition-all duration-200 pointer-events-none"
        style={{
          transform: `scale(${1 + scrollProgress * 0.5})`,
          opacity: 1 - scrollProgress,
        }}
      >
        <img
          src="https://red-causal-armadillo-397.mypinata.cloud/ipfs/bafybeihktbztsmdnnepg5a6ikjp5dqxal42vsm34cpldck2xrzofsvmoha"
          alt="Vista desde la nave"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10">
        {/* Sección Hero vacía para scroll inicial */}
        <section className="h-screen"></section>

        {/* Sección Main Content */}
        <section className="min-h-screen flex items-center justify-center py-20 px-4">
          <div className="bg-black/70 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-5xl w-full shadow-2xl border border-white/10">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500/50 shadow-lg shadow-cyan-500/20">
                  <img
                    src={studioData.logo}
                    alt={studioData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {studioData.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-cyan-300 mb-4 font-light">
                {studioData.subtitle}
              </p>
              
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                {studioData.description}
              </p>
            </div>

            {/* Navigation tabs */}
            <div className="flex justify-center gap-4 mb-10">
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeSection === "home"
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/50"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
                onClick={() => setActiveSection("home")}
              >
                Inicio
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeSection === "portfolio"
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/50"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
                onClick={() => setActiveSection("portfolio")}
              >
                Portfolio
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeSection === "contact"
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/50"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
                onClick={() => setActiveSection("contact")}
              >
                Contacto
              </button>
            </div>

            {/* Content Sections */}
            {activeSection === "home" && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all">
                    <h3 className="text-xl font-bold text-cyan-400 mb-2">Diseño Único</h3>
                    <p className="text-gray-300">Cada proyecto es una experiencia visual memorable</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all">
                    <h3 className="text-xl font-bold text-cyan-400 mb-2">Tecnología</h3>
                    <p className="text-gray-300">Stack moderno: React, Next.js, Three.js</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all">
                    <h3 className="text-xl font-bold text-cyan-400 mb-2">Performance</h3>
                    <p className="text-gray-300">Optimizado para velocidad y experiencia</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "portfolio" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studioData.projects.map((project, index) => (
                  <a
                    key={index}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all hover:scale-105 h-full">
                      <h3 className="text-xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 mb-4 text-sm">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {activeSection === "contact" && (
              <div className="text-center space-y-8">
                <p className="text-xl text-gray-300">
                  ¿Listo para lanzar tu proyecto al espacio? 🚀
                </p>
                <a
                  href="mailto:hello@taakstudio.com"
                  className="inline-block px-8 py-4 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/50"
                >
                  Iniciar Proyecto
                </a>
              </div>
            )}

            {/* Social Icons */}
            <div className="flex justify-center gap-6 mt-12 pt-8 border-t border-white/10">
              {studioData.socials.map((social, index) => {
                const key = social.title.toLowerCase() as SocialKey;
                const icon = iconMap[key];
                return icon ? (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-gray-400 hover:text-cyan-400 transition-all hover:scale-110"
                  >
                    {icon}
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
