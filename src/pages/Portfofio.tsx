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
    title: "Plateforme Freelance Guinée",
    description: "Plateforme web et mobile pour connecter freelances et clients en Guinée avec paiement sécurisé et messagerie intégrée.",
    mainImage: "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/freelance-main.png",
    images: [
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/freelance-1.png",
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/freelance-2.png",
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/freelance-3.png",
    ],
    type: "web",
    liveUrl: "https://freelance-guinee.com",
    technologies: ["Django", "React", "Flutter", "PostgreSQL"],
    category: "Web & Mobile Development",
  },
  {
    id: "2",
    title: "Application Immobilier",
    description: "Application web pour la gestion d'une agence immobilière avec accès locataires pour paiement en ligne et suivi des factures.",
    mainImage: "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/immobilier-main.png",
    images: [
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/immobilier-1.png",
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/immobilier-2.png",
    ],
    type: "web",
    liveUrl: "https://agence-immobiliere.com",
    technologies: ["PHP", "MySQL", "TailwindCSS", "Prometheus", "Grafana"],
    category: "Web Development",
  },
  {
    id: "3",
    title: "Plateforme Agricole Collaborative",
    description: "Application web pour optimiser les rendements agricoles en Guinée, gestion des parcelles, transport, stockage et conseils experts.",
    mainImage: "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/agriculture-main.png",
    images: [
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/agriculture-1.png",
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/agriculture-2.png",
    ],
    type: "web",
    liveUrl: "https://agriculture-guinee.com",
    technologies: ["Django", "React", "PostgreSQL", "Leaflet.js"],
    category: "Web Development",
  },
  {
    id: "4",
    title: "Plateforme Prise de Rendez-vous Médical",
    description: "Application web pour la prise de rendez-vous avec médecins et suivi des patients.",
    mainImage: "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/medical-main.png",
    images: [
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/medical-1.png",
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/medical-2.png",
    ],
    type: "web",
    liveUrl: "https://rendezvous-medical.com",
    technologies: ["React", "NestJS", "PostgreSQL", "TypeScript", "TailwindCSS"],
    category: "Web Development",
  },
  {
    id: "5",
    title: "Application Desktop Gestion de Bibliothèque",
    description: "Logiciel desktop pour gérer les livres, emprunts, retours et membres d'une bibliothèque.",
    mainImage: "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/library-main.png",
    images: [
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/library-1.png",
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/library-2.png",
    ],
    type: "desktop",
    technologies: ["Python", "Tkinter", "SQLite"],
    category: "Desktop Application",
  },
  {
    id: "6",
    title: "Application Mobile Réservation Restaurant & Hôtel",
    description: "Application mobile pour réserver des restaurants et hôtels avec paiement en ligne.",
    mainImage: "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/reservation-main.png",
    images: [
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/reservation-1.png",
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/reservation-2.png",
    ],
    type: "mobile",
    demoUrl: "https://demo.reservation-app.com",
    technologies: ["Flutter", "Firebase", "Stripe"],
    category: "Mobile Application",
  },
  {
    id: "7",
    title: "Teranga Palace",
    description: "Site web vitrine pour l'hôtel Teranga Palace avec informations sur les chambres et réservation en ligne.",
    mainImage: "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/teranga-main.png",
    images: [
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/teranga-1.png",
      "https://res.cloudinary.com/alhassane-b/image/upload/v1680000000/teranga-2.png",
    ],
    type: "web",
    liveUrl: "https://terangapalace.com",
    technologies: ["Next.js", "TailwindCSS", "React", "Vercel"],
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
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
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