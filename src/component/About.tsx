import { FaPhone } from "react-icons/fa6";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";

export default function About() {
  const { theme } = useTheme();
  const { about } = useContent();

  return (
    <section className={`py-20 px-4 m-auto max-w-6xl ${theme === "dark" ? "bg-gray-900" : "bg-white"}`} id="about">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-shrink-0">
          <img
            src={about.image}
            alt={about.imageAlt || about.title}
            className="w-80 md:block h-80 rounded object-cover"
          />
        </div>
        <div className="flex flex-col gap-6 flex-1">
          <div>
            <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">{about.eyebrow}</span>
            <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {about.title}
            </h2>
          </div>
          {about.paragraphs.map((paragraph, index) => (
            <p key={index} className={`text-lg leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              {paragraph}
            </p>
          ))}
          <a
            href={about.ctaHref || "#contact"}
            className="inline-flex items-center gap-2 px-6 py-3 w-fit rounded bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
          >
            <FaPhone /> {about.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
