import { motion, type Variants } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { FaCode, FaDatabase, FaMobile, FaCloud, FaTools } from 'react-icons/fa';

interface SkillCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  skills: {
    name: string;
    level: number; // 0-100
  }[];
}

const skillCategories: SkillCategory[] = [
  {
    id: '1',
    name: 'Frontend',
    icon: <FaCode size={24} />,
    skills: [
      { name: 'React', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'HTML | CSS', level: 95 }
    ]
  },
  {
    id: '2',
    name: 'Backend',
    icon: <FaDatabase size={24} />,
    skills: [
      { name: 'Express', level: 30 },
      { name: 'NestJs', level: 85 },
      { name: 'MySql', level: 82 },
      { name: 'Django + DRF', level: 50},
      { name: 'REST API', level: 93 }, 
      { name: 'PhP', level: 70}
    ]
  },
  {
    id: '3',
    name: 'Mobile',
    icon: <FaMobile size={24} />,
    skills: [
      { name: 'React Native', level: 87 },
      { name: 'Flutter', level: 75 },
    ]
  },
  {
    id: '4',
    name: 'Cloud & DevOps',
    icon: <FaCloud size={24} />,
    skills: [
      
      { name: 'Docker', level: 85 },

      { name: 'Git et GitHub', level: 95 }
    ]
  },
  {
    id: '5',
    name: 'Outils',
    icon: <FaTools size={24} />,
    skills: [
      { name: 'Figma', level: 88 },
      { name: 'VS Code', level: 95 },
      { name: 'Postman', level: 90 },
      { name: 'Trello', level: 80 },
      { name: 'VmWare workstation', level:80},
      { name: 'Photoshop', level:60},
      { name: 'Illustrator', level:60}
    ]
  }
];

export default function Skills() {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants:Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section className={`py-16 px-4 md:px-8 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`} id="skills">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">Compétences</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Technologies maîtrisées
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Un éventail de compétences pour répondre à tous vos besoins
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={cardVariants}
              whileHover={{ y: -2 }}
              className={`p-6 rounded transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border border-gray-700/50 hover:border-amber-500/50' 
                  : 'bg-gray-50 border border-gray-200 hover:border-amber-300'
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded ${
                  theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
                }`}>
                  <div className="text-amber-500">
                    {category.icon}
                  </div>
                </div>
                <h3 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {category.name}
                </h3>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {category.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {skill.name}
                      </span>
                      <span className={`text-sm font-semibold text-amber-500`}>
                        {skill.level}%
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
