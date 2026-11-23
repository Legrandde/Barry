import type { ReactNode } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaGlobe,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";
import { track } from "../services/analytics";
import { FaLocationDot } from "react-icons/fa6";
import { PhoneCall } from "lucide-react";

const SOCIAL_ICONS: Record<string, ReactNode> = {
  github: <FaGithub size={20} />,
  linkedin: <FaLinkedin size={20} />,
  twitter: <FaTwitter size={20} />,
  x: <FaTwitter size={20} />,
  facebook: <FaFacebook size={20} />,
  instagram: <FaInstagram size={20} />,
  youtube: <FaYoutube size={20} />,
  tiktok: <FaTiktok size={20} />,
  whatsapp: <FaWhatsapp size={20} />,
  email: <FaEnvelope size={20} />,
  website: <FaGlobe size={20} />,
};

export default function Footer() {
  const { theme } = useTheme();
  const { site, contact } = useContent();

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`w-full border-t ${
        theme === "dark" ? "bg-gray-900 text-gray-300 border-gray-800" : "bg-white text-gray-800 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              <span className="text-amber-500">{site.lastName}</span> {site.firstName}
            </h3>
            <p className={`mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{site.footerDescription}</p>
            <div className="flex gap-4">
              {contact.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("social_click", social.icon)}
                  className={`p-2 rounded-full transition-colors ${
                    theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white hover:bg-gray-200 text-gray-800"
                  }`}
                  aria-label={social.label}
                >
                  {SOCIAL_ICONS[social.icon] ?? SOCIAL_ICONS.website}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Liens rapides</h4>
            <ul className="space-y-2">
              {[
                ["#accueil", "Accueil"],
                ["#about", "À propos"],
                ["#services", "Services"],
                ["#skills", "Compétences"],
                ["#parcours", "Parcours"],
                ["#formation", "Formation"],
                ["#projets", "Projets"],
                ["#testimonials", "Témoignages"],
                ["#contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className={`hover:text-amber-500 transition-colors ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <PhoneCall className="text-amber-500" />
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{site.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-amber-500" />
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{site.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <FaLocationDot className="text-amber-500" />
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{site.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={`border-t pt-8 ${theme === "dark" ? "border-gray-800" : "border-gray-300"}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
              © {currentYear} {site.lastName} {site.firstName}. Tous droits réservés.
            </p>
            <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>{site.footerTagline}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
