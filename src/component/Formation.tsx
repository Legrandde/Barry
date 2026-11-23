import { motion, type Variants } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";
import { FaGraduationCap, FaCalendarAlt, FaAward } from "react-icons/fa";

export default function Formation() {
  const { theme } = useTheme();
  const { formation } = useContent();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className={`py-16 px-4 md:px-8 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`} id="formation">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">{formation.eyebrow}</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {formation.title}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {formation.description}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6"
        >
          {formation.items.map((edu) => (
            <motion.div
              key={edu.id}
              variants={itemVariants}
              whileHover="hover"
              className={`relative overflow-hidden rounded transition-all duration-300 w-full md:w-[calc(50%-12px)] lg:w-[400px] ${
                theme === "dark"
                  ? "bg-gray-800/50 border border-gray-700/50 hover:border-amber-500/50"
                  : "bg-white border border-gray-200 hover:border-amber-300"
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

              <div className="p-6">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`inline-flex p-4 rounded mb-4 ${theme === "dark" ? "bg-amber-500/20" : "bg-amber-100"}`}
                >
                  <FaGraduationCap className="text-amber-500" size={32} />
                </motion.div>

                <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{edu.degree}</h3>
                <p className="text-lg font-semibold mb-3 text-amber-500">{edu.institution}</p>

                <div className={`flex items-center gap-2 mb-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  <FaCalendarAlt />
                  <span>{edu.period}</span>
                </div>

                <p className={`mb-4 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{edu.description}</p>

                {edu.achievements && edu.achievements.length > 0 && (
                  <div className={`pt-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <FaAward className="text-amber-500" size={16} />
                      <span className={`text-sm font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Réalisations
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {edu.achievements.map((achievement, index) => (
                        <li key={index} className={`text-xs flex items-center gap-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${theme === "dark" ? "bg-amber-500" : "bg-amber-400"}`} />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
