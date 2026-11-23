import { useState } from "react";
import { BiMenu, BiPhone } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { site, visibility } = useContent();
  const [menuDisplay, setMenuDisplay] = useState<boolean>(false);

  const navLinks = [
    { href: "#accueil", label: "Accueil", key: "hero" },
    { href: "#about", label: "À propos", key: "about" },
    { href: "#services", label: "Services", key: "services" },
    { href: "#skills", label: "Compétences", key: "skills" },
    { href: "#parcours", label: "Parcours", key: "parcours" },
    { href: "#formation", label: "Formation", key: "formation" },
    { href: "#projets", label: "Projets", key: "projects" },
    { href: "#contact", label: "Contact", key: "contact" },
  ].filter((item) => visibility[item.key] !== false);

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-sm ${
        theme === "dark" ? "bg-gray-900/80 border-b border-gray-800" : "bg-white/80 border-b border-gray-200"
      }`}
    >
      <div className="flex p-4 w-full items-center justify-around max-w-7xl mx-auto">
        <h1 className={`text-xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          <span className="font-bold text-amber-500">{site.lastName}</span> {site.firstName}
        </h1>
        <div className="flex items-center justify-center gap-2 md:gap-12">
          <div className={`md:flex hidden items-center justify-center gap-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            <FaLocationDot className="text-amber-500" />
            {site.location}
          </div>
          <div className={`flex items-center justify-center gap-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            <BiPhone className="text-amber-500" />
            {site.phone}
          </div>
          <a
            href="#contact"
            className={`p-2 hover:cursor-pointer hover:bg-amber-500 border border-amber-500 rounded transition-colors ${
              theme === "dark" ? "bg-gray-800 text-white hover:text-white" : "bg-white text-gray-900 hover:text-white"
            }`}
          >
            Contact
          </a>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-yellow-400" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          <BiMenu
            size={30}
            className={`md:hidden hover:cursor-pointer ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            onClick={() => setMenuDisplay(!menuDisplay)}
          />
        </div>
      </div>

      <div
        className={`${menuDisplay ? "flex flex-col" : "hidden"} md:flex md:flex-row md:flex-wrap p-4 items-center justify-center gap-x-8 gap-y-2 md:w-[90%] lg:w-[75%] m-auto border-t ${
          theme === "dark" ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-4 md:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuDisplay(false)}
              className={`whitespace-nowrap hover:text-amber-500 transition-colors ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
