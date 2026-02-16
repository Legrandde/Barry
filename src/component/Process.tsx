import { motion, type Variants } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { FaSearch, FaLightbulb, FaCode, FaRocket, FaCheckCircle } from 'react-icons/fa';

interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const processSteps: ProcessStep[] = [
  {
    id: '1',
    number: '01',
    title: 'Analyse & Conception',
    description: 'Je commence par comprendre vos besoins, analyser votre marché et concevoir une solution adaptée.',
    icon: <FaSearch size={24} />
  },
  {
    id: '2',
    number: '02',
    title: 'Planification',
    description: 'Élaboration d\'un plan détaillé avec des jalons clairs et un calendrier réaliste pour le projet.',
    icon: <FaLightbulb size={24} />
  },
  {
    id: '3',
    number: '03',
    title: 'Développement',
    description: 'Création de la solution avec un code propre, maintenable et suivant les meilleures pratiques.',
    icon: <FaCode size={24} />
  },
  {
    id: '4',
    number: '04',
    title: 'Tests & Déploiement',
    description: 'Tests approfondis, optimisation des performances et déploiement sur les plateformes cibles.',
    icon: <FaRocket size={24} />
  },
  {
    id: '5',
    number: '05',
    title: 'Support & Maintenance',
    description: 'Accompagnement continu, maintenance et améliorations pour garantir la pérennité de votre projet.',
    icon: <FaCheckCircle size={24} />
  }
];

export default function Process() {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants:Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section className={`py-20 px-4 md:px-8 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`} id="process">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">Processus</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Comment je travaille
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Une méthodologie éprouvée pour transformer vos idées en succès
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Connecting Line */}
          <div className={`hidden md:block absolute left-8 top-0 bottom-0 w-0.5 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
          }`} />

          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                variants={itemVariants}
                className="relative flex flex-col md:flex-row items-start gap-6"
              >
                {/* Step Number & Icon */}
                <div className="flex items-center gap-4">
                  {/* Timeline Dot */}
                  <div className={`hidden md:block absolute left-6 w-3 h-3 rounded-full z-10 ${
                    theme === 'dark' 
                      ? 'bg-amber-500' 
                      : 'bg-amber-500'
                  }`} />
                  
                  {/* Step Number */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded flex items-center justify-center font-bold text-lg ${
                    theme === 'dark' 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`p-3 rounded ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                  }`}>
                    <div className="text-amber-500">
                      {step.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 p-6 rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-800/30 border border-gray-700/50' 
                    : 'bg-gray-50 border border-gray-100'
                }`}>
                  <h3 className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
