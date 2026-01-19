import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExternalLinkAlt, FaPlayCircle } from 'react-icons/fa';

import { useTheme } from '../contexts/ThemeContext';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

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


export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { theme } = useTheme();

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 dark:bg-black/80 z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded shadow-2xl ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-white text-gray-900'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                aria-label="Fermer"
              >
                <FaTimes size={20} />
              </button>

              {/* Main Image */}
              <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-t-2xl">
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Title and Description */}
                <div className="mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 text-amber-500 dark:text-amber-400">
                    {project.title}
                  </h2>
                  <p className={`text-lg ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {project.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    Technologies utilisées
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 dark:bg-amber-500/30 text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional Images */}
                {project.images && project.images.length > 0 && (
                  <div className="mb-6">
                    <h3 className={`text-xl font-semibold mb-3 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      Autres captures
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative overflow-hidden rounded aspect-video"
                        >
                          <img
                            src={image}
                            alt={`${project.title} - Capture ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  {project.type === 'web' && project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors"
                    >
                      <FaExternalLinkAlt />
                      Visiter le site
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white font-semibold transition-colors"
                    >
                      <FaPlayCircle />
                      Voir la démo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
