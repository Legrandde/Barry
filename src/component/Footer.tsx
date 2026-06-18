import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { FaLocationDot } from 'react-icons/fa6';
import { PhoneCall } from 'lucide-react';

export default function Footer() {
  const { theme } = useTheme();

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`w-full border-t ${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-300 border-gray-800' 
        : 'bg-white text-gray-800 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className={`text-2xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="text-amber-500">Barry</span> Alhassane
            </h3>
            <p className={`mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Ingénieur informatique passionné par le développement web et mobile. 
              Créateur de solutions innovantes et performantes.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-white hover:bg-gray-200 text-gray-800'
                }`}
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/alhassane-barry-71116728b?lipi=urn%3Ali%3Apage%3Ad_flagship3_messaging_conversation_detail%3B20Px4NFMRA6jLrwQ%2FI8uQQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-white hover:bg-gray-200 text-gray-800'
                }`}
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-white hover:bg-gray-200 text-gray-800'
                }`}
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Liens rapides
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#accueil"
                  className={`hover:text-amber-500 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className={`hover:text-amber-500 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  À propos
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className={`hover:text-amber-500 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  className={`hover:text-amber-500 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Compétences
                </a>
              </li>
              <li>
                <a
                  href="#parcours"
                  className={`hover:text-amber-500 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Parcours
                </a>
              </li>
              <li>
                <a
                  href="#formation"
                  className={`hover:text-amber-500 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Formation
                </a>
              </li>
              <li>
                <a
                  href="#projets"
                  className={`hover:text-amber-500 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Projets
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className={`hover:text-amber-500 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Témoignages
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className={`hover:text-amber-500 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <PhoneCall className="text-amber-500" />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  +224 626 01 45 52
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-amber-500" />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  barryalhassane476@gmail.com
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaLocationDot className="text-amber-500" />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Timbi Madina
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t pt-8 ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-300'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              © {currentYear} Barry Alhassane. Tous droits réservés.
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Développé avec passion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
