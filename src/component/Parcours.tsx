import { motion, type Variants } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { FaBriefcase, FaCalendarAlt } from 'react-icons/fa';

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  technologies?: string[];
}

const experiences: Experience[] = [
  {
    id: '1',
    title: 'Stagiére  maintenance et développement web',
    company: 'Tout en Géni Informatique (TGI)',
    period: 'Mars 2024 - Avril 2024',
    description: 'Développement d\'applications avec  HTML,CSS, Javascript et Wordpresse. Programmation et maintenance du matériel informatique.',
    technologies: ['HTML', 'Css', 'Javascript', 'Wordpress']
  },
  {
    id: '2',
    title: 'Stagiére  en Réseau informatique et multi médias',
    company: 'Tout en Géni Informatique (TGI)',
    period: 'Mai 2025 - Jui 2025',
    description: 'Mise en place de server DHCP, Windows Server, mise en place d\'un réseau d\' entreprise.',
    technologies: ['Rufus', 'DHCP', 'vmware Workstation 17']
  },
  
];

export default function Parcours() {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section className={`py-20 px-4 md:px-8 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
    }`} id="parcours">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">Expérience</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Mon parcours professionnel
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Des années d'expérience au service de l'innovation
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Timeline Line */}
          <div className={`absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
          }`} />

          {/* Experiences */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-start md:items-center gap-6`}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-6 md:left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-amber-500' 
                    : 'bg-amber-500'
                } z-10`} />

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 md:w-[45%] p-6 rounded transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 border border-gray-600/50 hover:border-amber-500/50' 
                    : 'bg-white border border-gray-200 hover:border-amber-300'
                }`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded ${
                      theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
                    }`}>
                      <FaBriefcase className="text-amber-500" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {exp.title}
                      </h3>
                      <p className={`text-lg font-semibold mb-2 text-amber-500`}>
                        {exp.company}
                      </p>
                      <div className={`flex items-center gap-2 text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <FaCalendarAlt />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className={`mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {exp.description}
                  </p>

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            theme === 'dark'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
