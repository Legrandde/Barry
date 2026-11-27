import { useEffect, useState } from "react";
import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  Briefcase,
  Code2,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Moon,
  Share2,
  Sliders,
  Sun,
  Target,
  UserCog,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/toast";
import { getUnreadCount } from "../../services/adminApi";
import { applyAdminSeo } from "../../services/seo";
import ConfirmDialog from "../../component/admin/ConfirmDialog";

const SECTION_LINKS = [
  { key: "site", label: "Site & Coordonnées" },
  { key: "theme", label: "Thème" },
  { key: "hero", label: "Bannière (Hero)" },
  { key: "about", label: "À propos" },
  { key: "services", label: "En-tête Services" },
  { key: "skills", label: "En-tête Compétences" },
  { key: "stats", label: "Chiffres clés" },
  { key: "parcours", label: "En-tête Parcours" },
  { key: "formation", label: "En-tête Formation" },
  { key: "process", label: "Processus" },
  { key: "projects", label: "En-tête Projets" },
  { key: "testimonials", label: "En-tête Témoignages" },
  { key: "contact", label: "Contact" },
  { key: "cta", label: "Appel à l'action (CTA)" },
];

const COLLECTION_LINKS = [
  { path: "projects", label: "Projets", Icon: FolderKanban },
  { path: "services", label: "Services", Icon: Layers },
  { path: "skill-categories", label: "Compétences", Icon: Code2 },
  { path: "experiences", label: "Parcours", Icon: Briefcase },
  { path: "educations", label: "Formation", Icon: GraduationCap },
  { path: "testimonials", label: "Témoignages", Icon: MessageSquareQuote },
  { path: "social-links", label: "Réseaux sociaux", Icon: Share2 },
];

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const [unread, setUnread] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    applyAdminSeo();
  }, []);

  useEffect(() => {
    if (!admin) return;
    getUnreadCount()
      .then((r) => setUnread(r.unread))
      .catch(() => {});
  }, [admin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300">
        Chargement de l'administration...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/lamougoun" replace />;
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-amber-500 text-white font-medium"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
    }`;

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Barre supérieure mobile */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-bold">
          <span className="text-amber-500">Barry</span> CMS
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            aria-label="Changer le thème"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/" target="_blank" className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar FIXE sur toute la hauteur */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              <span className="text-amber-500">Barry</span> CMS
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Connecté : {admin.username}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              title={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
              aria-label="Changer le thème"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              to="/"
              target="_blank"
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Voir le portfolio"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={closeMobile}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              aria-label="Fermer le menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-5">
          <div className="space-y-1">
            <NavLink to="/admin" end className={navClass} onClick={closeMobile}>
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Tableau de bord
              </span>
            </NavLink>
            <NavLink to="/admin/prospection" className={navClass} onClick={closeMobile}>
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4" /> Prospection
              </span>
            </NavLink>
            <NavLink to="/admin/messages" className={navClass} onClick={closeMobile}>
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> Messages
              </span>
              {unread > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white font-semibold">{unread}</span>
              )}
            </NavLink>
            <NavLink to="/admin/media" className={navClass} onClick={closeMobile}>
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Médias
              </span>
            </NavLink>
            <NavLink to="/admin/compte" className={navClass} onClick={closeMobile}>
              <span className="flex items-center gap-2">
                <UserCog className="w-4 h-4" /> Mon compte
              </span>
            </NavLink>
          </div>

          <div>
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Collections</p>
            <div className="space-y-1">
              {COLLECTION_LINKS.map(({ path, label, Icon }) => (
                <NavLink key={path} to={`/admin/collections/${path}`} className={navClass} onClick={closeMobile}>
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" /> {label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Sections</p>
            <div className="space-y-1">
              {SECTION_LINKS.map(({ key, label }) => (
                <NavLink key={key} to={`/admin/sections/${key}`} className={navClass} onClick={closeMobile}>
                  <span className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5" /> {label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800 shrink-0">
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal décalé de la largeur de la sidebar fixe */}
      <main className="md:ml-64 min-h-screen p-6 md:p-8">
        <Outlet />
      </main>

      <ConfirmDialog
        open={logoutModalOpen}
        title="Se déconnecter"
        description="Voulez-vous vraiment quitter l'espace d'administration ?"
        confirmLabel="Se déconnecter"
        cancelLabel="Rester connecté"
        onConfirm={() => {
          setLogoutModalOpen(false);
          logout();
          toast.info("Vous avez été déconnecté.");
        }}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </div>
  );
}
