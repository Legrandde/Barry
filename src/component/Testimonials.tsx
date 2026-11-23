import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Testimonials() {
  const { theme } = useTheme();
  const { testimonials } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = testimonials.items;
  if (items.length === 0) return null;

  const safeIndex = currentIndex % items.length;
  const current = items[safeIndex];

  const nextTestimonial = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prevTestimonial = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  return (
    <section className={`py-16 px-4 md:px-8 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`} id="testimonials">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">{testimonials.eyebrow}</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {testimonials.title}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {testimonials.description}
          </p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative">
          <div className="relative overflow-hidden rounded">
            <motion.div
              key={safeIndex}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`p-8 md:p-12 rounded ${
                theme === "dark" ? "bg-gray-700/50 border border-gray-600/50" : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex justify-center mb-6">
                <FaQuoteLeft className="text-amber-500" size={40} />
              </div>

              <div className="flex justify-center gap-1 mb-6">
                {[...Array(current.rating)].map((_, i) => (
                  <FaStar key={i} className="text-amber-400" size={20} />
                ))}
              </div>

              <p className={`text-lg md:text-xl text-center mb-8 italic ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                "{current.text}"
              </p>

              <div className="flex flex-col items-center">
                {current.image && (
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-amber-500"
                  />
                )}
                <h4 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{current.name}</h4>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {current.role}
                  {current.company ? ` - ${current.company}` : ""}
                </p>
              </div>
            </motion.div>

            {items.length > 1 && (
              <>
                <button
                  onClick={prevTestimonial}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-colors ${
                    theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-white hover:bg-gray-100 text-gray-800"
                  } shadow-lg`}
                  aria-label="Témoignage précédent"
                >
                  <FaChevronLeft size={20} />
                </button>
                <button
                  onClick={nextTestimonial}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-colors ${
                    theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-white hover:bg-gray-100 text-gray-800"
                  } shadow-lg`}
                  aria-label="Témoignage suivant"
                >
                  <FaChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === safeIndex ? "bg-amber-500 w-8" : theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                }`}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
