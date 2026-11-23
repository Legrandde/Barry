import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useEffect, useState, type ReactNode } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";
import { FaProjectDiagram, FaUsers, FaAward, FaCode, FaClock, FaStar } from "react-icons/fa";

const STAT_ICONS: Record<string, ReactNode> = {
  projects: <FaProjectDiagram size={40} />,
  users: <FaUsers size={40} />,
  award: <FaAward size={40} />,
  code: <FaCode size={40} />,
  clock: <FaClock size={40} />,
  star: <FaStar size={40} />,
  default: <FaProjectDiagram size={40} />,
};

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const increment = value / (duration * 60);
      const timer = setInterval(() => {
        setCount((prev) => {
          const next = prev + increment;
          if (next >= value) {
            clearInterval(timer);
            return value;
          }
          return next;
        });
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const { theme } = useTheme();
  const { stats } = useContent();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className={`py-20 px-4 md:px-8 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`} id="stats">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">{stats.eyebrow}</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {stats.title}
          </h2>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-center md:grid-cols-4 gap-6"
        >
          {stats.items.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className={`relative overflow-hidden rounded p-6 ${
                theme === "dark"
                  ? "bg-gray-800/50 border border-gray-700/50 hover:border-amber-500/50"
                  : "bg-gray-50 border border-gray-200 hover:border-amber-300"
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5" />

              <div className={`inline-flex p-4 rounded mb-4 bg-gradient-to-br ${stat.color} text-white`}>
                {STAT_ICONS[stat.icon] ?? STAT_ICONS.default}
              </div>

              <div className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>

              <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
