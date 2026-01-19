import { useState } from "react";
import { motion } from "framer-motion";
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
import Testimonials from "../component/Testimonials";
import CTA from "../component/CTA";
import ProjectsSection from "../component/ProjectsSection";
import ProjectModal from "../component/ProjectModal";

import { useTheme } from "../contexts/ThemeContext";

interface Project {
  id: string;
  title: string;
  description: string;
  mainImage: string; 
  images: string[]; // 2-3 images supplémentaires
  type: 'web' | 'mobile' | 'desktop' | 'other';
  liveUrl?: string; // URL pour visiter le projet (si app web)
  demoUrl?: string; // URL pour la démo (si applicable)
  technologies: string[];
  category: string;
}


// Données de projets exemple
const projects: Project[] = [
    {
        id: "1",
        title: "Application E-Commerce",
        description: "Une application e-commerce complète avec gestion de panier, paiement et administration.",
        mainImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
        images: [
            "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800",
            "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800",
            "https://images.unsplash.com/photo-1556742504-0766b12e7b93?w=800"
        ],
        type: "web",
        liveUrl: "https://example.com",
        technologies: ["React", "TypeScript", "Node.js", "MongoDB"],
        category: "Web Development"
    },
    {
        id: "2",
        title: "Application Mobile de Gestion",
        description: "Application mobile native pour la gestion de tâches et projets avec synchronisation cloud.",
        mainImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
        images: [
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800",
            "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800"
        ],
        type: "mobile",
        demoUrl: "https://demo.example.com",
        technologies: ["React Native", "Firebase", "Redux"],
        category: "Mobile Development"
    },
    {
        id: "3",
        title: "Plateforme de Blog",
        description: "Plateforme de blog moderne avec système de commentaires et authentification utilisateur.",
        mainImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        images: [
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800",
            "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
        ],
        type: "web",
        liveUrl: "https://blog.example.com",
        technologies: ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
        category: "Web Development"
    },
    {
        id: "4",
        title: "Dashboard Analytique",
        description: "Tableau de bord analytique avec visualisations de données en temps réel.",
        mainImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        images: [
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
        ],
        type: "web",
        liveUrl: "https://dashboard.example.com",
        technologies: ["Vue.js", "D3.js", "Express", "MySQL"],
        category: "Web Development"
    }
];

export default function Portfolio(){
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

    // Animation variants pour l'entrée du site
    const pageVariants = {
        initial: { opacity: 0 },
        animate: { 
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    return(
        <motion.div 
            className={`min-h-screen transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
            initial="initial"
            animate="animate"
            variants={pageVariants}
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Header />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
            >
                <Banner />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <About />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <Services />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <Skills />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <Stats />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <Parcours />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <Formation />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <Process />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <ProjectsSection projects={projects} onProjectClick={handleProjectClick} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <Testimonials />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <Contact />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <CTA />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <Footer />
            </motion.div>
            
            {/* Modal */}
            <ProjectModal 
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </motion.div>
    )
}