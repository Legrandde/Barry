import { motion, type Variants } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";
import { FaCode, FaDatabase, FaMobile, FaCloud, FaTools } from "react-icons/fa";
import type { ReactNode } from "react";

const SKILL_ICONS: Record<string, ReactNode> = {
  code: <FaCode size={24} />,
  database: <FaDatabase size={24} />,
  mobile: <FaMobile size={24} />,
  cloud: <FaCloud size={24} />,
  tools: <FaTools size={24} />,
  default: <FaCode size={24} />,
};

export default function Skills() {
  const { theme } = useTheme();
  const { skills } = useContent();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className={`py-16 px-4 md:px-8 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`} id="skills">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">{skills.eyebrow}</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {skills.title}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {skills.description}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skills.categories.map((category) => (
            <motion.div
              key={category.id}
              variants={cardVariants}
              whileHover={{ y: -2 }}
              className={`p-6 rounded transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800/50 border border-gray-700/50 hover:border-amber-500/50"
                  : "bg-gray-50 border border-gray-200 hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded ${theme === "dark" ? "bg-amber-500/20" : "bg-amber-100"}`}>
                  <div className="text-amber-500">{SKILL_ICONS[category.icon] ?? SKILL_ICONS.default}</div>
                </div>
                <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{category.name}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        {skill.name}
                      </span>
                      <span className="text-sm font-semibold text-amber-500">{skill.level}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
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
