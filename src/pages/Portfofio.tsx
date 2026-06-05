import { useState } from "react";
import { motion } from "framer-motion";
import type { Variants, Transition } from "framer-motion";
import Header from "../component/Header";
import Banner from "../component/Banner";
import About from "../component/About";
import Contact from "../component/Contact";
import Footer from "../component/Footer";
import Services from "../component/Services";
import Skills from "../component/Skills";
import Parcours from "../component/Parcours";
import Formation from "../component/Formation";
import Stats from "../component/Stats";
import Process from "../component/Process";
import CTA from "../component/CTA";
import ProjectsSection from "../component/ProjectsSection";
import ProjectModal from "../component/ProjectModal";
import { useTheme } from "../contexts/ThemeContext";
import { BsWhatsapp } from "react-icons/bs";

export interface Project {
  id: string;
  title: string;
  description: string;
  mainImage: string;
  images: string[];
  type: 'web' | 'mobile' | 'desktop' | 'other';
  liveUrl?: string;
  demoUrl?: string;
  technologies: string[];
  category: string;
}

const projects: Project[] = [
 
  {
    id: "1",
    title: "Application Immobilier",
    description: "Application web pour la gestion d'une agence immobilière avec accès locataires pour paiement en ligne et suivi des factures.",
    mainImage: "classiqueImmo/banner.jpeg",
    images: [
      "classiqueImmo/1.jpeg",
      "classiqueImmo/2.jpeg",
    ],
    type: "web",
    technologies: ["PHP", "MySQL", "TailwindCSS", "Prometheus", "Grafana"],
    category: "Web Development",
  },
  {
    id: "2",
    title: "Application mise en relation  agritulteurs consommateurs ",
    description: "Application web pour optimiser les rendements agricoles en Guinée, gestion des parcelles, transport, stockage et conseils experts.",
    mainImage: "leydi/realisation-1 cpie.png",
    images: [
      "leydi/ba.png",
      "leydi/Sans titre-1-Récupéré.png",
      "leydi/c.png",
    ],
    type: "mobile",
    technologies: ["Django", "React Native", "PostgreSQL"],
    category: "Web Development",
  },
  {
    id: "3",
    title: "Plateforme Prise de Rendez-vous Médical",
    description: "Application web pour la prise de rendez-vous avec médecins et suivi des patients.",
    mainImage: "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/medical-main.png",
    images: [
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/medical-1.png",
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/medical-2.png",
    ],
    type: "web",
    technologies: ["React", "NestJS", "PostgreSQL", "TypeScript", "TailwindCSS"],
    category: "Web Development",
  },
  {
    id: "4",
    title: "Application Desktop Gestion de Bibliothèque",
    description: "Logiciel desktop pour gérer les livres, emprunts, retours et membres d'une bibliothèque.",
    mainImage: "afrilib/banner.png",
    images: [
      "afrilib/1.png",
      "afrilib/2.png",
    ],
    type: "desktop",
    technologies: ["Java", "JavaSwing", "Mysql"],
    category: "Desktop Application",
  },
  {
    id: "5",
    title: "Application Mobile Réservation Restaurant & Hôtel",
    description: "Application mobile pour réserver des restaurants et hôtels avec paiement en ligne.",
    mainImage: "guesthub/banner.png",
    images: [
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/reservation-1.png",
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/reservation-2.png",
    ],
    type: "mobile",
    technologies: ["React native", "Laravel"],
    category: "Mobile Application",
  },
  {
    id: "6",
    title: "Teranga Palace",
    description: "Site web vitrine pour l'hôtel Teranga Palace avec informations sur les chambres et réservation en ligne.",
    mainImage: "teranga/terangaBanner.png",
    images: [
      "teranga/1.png",
      "teranga/2.png",
      "teranga/3.png",
    ],
    type: "web",
    liveUrl: "https://dakar-dreams-git-main-alhassane-barrys-projects.vercel.app/",
    technologies: ["TailwindCSS", "React", "Vercel"],
    category: "Web Development",
  },
];

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const fadeUpTransition: Transition = {
  duration: 0.55,
  ease: [0.16, 1, 0.3, 1],
};

export default function Portfolio() {
  const { theme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <div className={`min-h-screen  transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <button onClick={() => window.open("https://wa.me/224626014552", "_blank")} className="bg-green-400 fixed bottom-4 right-4 p-2 rounded-2xl cursor-pointer shadow-3xl shadow-green-100 z-10"><BsWhatsapp color="white" size={30} /></button>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <Header />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
        <Banner />
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
        <About />
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
        <Services />
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
        <Skills />
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
        <Stats />
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
        <Parcours />
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
        <Formation />
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
        <Process />
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
        <ProjectsSection projects={projects} onProjectClick={handleProjectClick} />
      </motion.div>

      {/* Section Témoignages */}
      <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
        {/* <Testimonials /> */}
      </motion.div>

      <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
        <Contact />
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <CTA />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <Footer />
      </motion.div>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}