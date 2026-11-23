import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";
import { FaSearch, FaLightbulb, FaCode, FaRocket, FaCheckCircle } from "react-icons/fa";

const PROCESS_ICONS: Record<string, ReactNode> = {
  search: <FaSearch size={24} />,
  lightbulb: <FaLightbulb size={24} />,
  code: <FaCode size={24} />,
  rocket: <FaRocket size={24} />,
  check: <FaCheckCircle size={24} />,
  default: <FaCode size={24} />,
};

export default function Process() {
  const { theme } = useTheme();
  const { process } = useContent();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className={`py-20 px-4 md:px-8 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`} id="process">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">{process.eyebrow}</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {process.title}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {process.description}
          </p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative">
          <div className={`hidden md:block absolute left-8 top-0 bottom-0 w-0.5 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`} />

          <div className="space-y-8">
            {process.steps.map((step, idx) => (
              <motion.div key={idx} variants={itemVariants} className="relative flex flex-col md:flex-row items-start gap-6">
                <div className="flex items-center gap-4">
                  <div className="hidden md:block absolute left-6 w-3 h-3 rounded-full z-10 bg-amber-500" />

                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded flex items-center justify-center font-bold text-lg ${
                      theme === "dark" ? "bg-amber-500/20 text-amber-400" : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {step.number}
                  </div>

                  <div className={`p-3 rounded ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                    <div className="text-amber-500">{PROCESS_ICONS[step.icon] ?? PROCESS_ICONS.default}</div>
                  </div>
                </div>

                <div
                  className={`flex-1 p-6 rounded ${
                    theme === "dark" ? "bg-gray-800/30 border border-gray-700/50" : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <h3 className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{step.title}</h3>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
