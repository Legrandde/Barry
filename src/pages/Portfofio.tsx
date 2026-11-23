import { useEffect, useState } from "react";
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
import Testimonials from "../component/Testimonials";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";
import { track, trackPageview } from "../services/analytics";
import type { ProjectItem } from "../types/content";
import { BsWhatsapp } from "react-icons/bs";

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
  const { site, projects, testimonials, visibility } = useContent();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    trackPageview();
  }, []);

  const isVisible = (key: string) => visibility[key] !== false;

  const handleProjectClick = (project: ProjectItem) => {
    track("project_open", project.slug);
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      {site.whatsappNumber && (
        <button
          onClick={() => {
            track("whatsapp_click");
            window.open(`https://wa.me/${site.whatsappNumber}`, "_blank");
          }}
          className="bg-green-400 fixed bottom-4 right-4 p-2 rounded-2xl cursor-pointer shadow-3xl shadow-green-100 z-10"
          aria-label="WhatsApp"
        >
          <BsWhatsapp color="white" size={30} />
        </button>
      )}

      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <Header />
      </motion.div>

      {isVisible("hero") && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
          <Banner />
        </motion.div>
      )}

      {isVisible("about") && (
        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
          <About />
        </motion.div>
      )}

      {isVisible("services") && (
        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
          <Services />
        </motion.div>
      )}

      {isVisible("skills") && (
        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
          <Skills />
        </motion.div>
      )}

      {isVisible("stats") && (
        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
          <Stats />
        </motion.div>
      )}

      {isVisible("parcours") && (
        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
          <Parcours />
        </motion.div>
      )}

      {isVisible("formation") && (
        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
          <Formation />
        </motion.div>
      )}

      {isVisible("process") && (
        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
          <Process />
        </motion.div>
      )}

      {isVisible("projects") && (
        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
          <ProjectsSection projects={projects.items} onProjectClick={handleProjectClick} />
        </motion.div>
      )}

      {isVisible("testimonials") && testimonials.items.length > 0 && (
        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
          <Testimonials />
        </motion.div>
      )}

      {isVisible("contact") && (
        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={fadeUpTransition}>
          <Contact />
        </motion.div>
      )}

      {isVisible("cta") && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <CTA />
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <Footer />
      </motion.div>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
