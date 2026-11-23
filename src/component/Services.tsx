import Carte from "./Carte";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";

export default function Services() {
  const { theme } = useTheme();
  const { services } = useContent();

  return (
    <section className={`py-20 px-4 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`} id="services">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">{services.eyebrow}</span>
          <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {services.title}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {services.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.items.map((service) => (
            <Carte key={service.id} title={service.title} description={service.description} />
          ))}
        </div>
      </div>
    </section>
  );
}
