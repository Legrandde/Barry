import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle2, Code2, Globe, Mail, Sparkles } from "lucide-react";
import { GiProgression } from "react-icons/gi";
import {
  SiGithub,
  SiDocker,
  SiDjango,
  SiLaravel,
  SiReact,
  SiTailwindcss,
  SiNestjs,
  SiPostgresql,
  SiTypescript,
  SiPython,
  SiFastapi,
  SiFlutter,
  SiLinkedin,
  SiX,
  SiInstagram,
  SiFacebook,
  SiWhatsapp,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";

const LOGO_MAP: Record<string, { Icon: IconType; lightColor: string; darkColor: string }> = {
  github: { Icon: SiGithub, lightColor: "#24292e", darkColor: "#ffffff" },
  docker: { Icon: SiDocker, lightColor: "#2496ED", darkColor: "#2496ED" },
  django: { Icon: SiDjango, lightColor: "#092E20", darkColor: "#44B78B" },
  laravel: { Icon: SiLaravel, lightColor: "#FF2D20", darkColor: "#FF2D20" },
  react: { Icon: SiReact, lightColor: "#007ACC", darkColor: "#61DAFB" },
  tailwindcss: { Icon: SiTailwindcss, lightColor: "#06B6D4", darkColor: "#38BDF8" },
  nestjs: { Icon: SiNestjs, lightColor: "#E0234E", darkColor: "#E0234E" },
  postgresql: { Icon: SiPostgresql, lightColor: "#336791", darkColor: "#60A5FA" },
  typescript: { Icon: SiTypescript, lightColor: "#3178C6", darkColor: "#3178C6" },
  python: { Icon: SiPython, lightColor: "#3776AB", darkColor: "#FFD43B" },
  fastapi: { Icon: SiFastapi, lightColor: "#009688", darkColor: "#009688" },
  flutter: { Icon: SiFlutter, lightColor: "#02569B", darkColor: "#54C5F8" },
};

const ANGLES = [0, 90, 144, 216, 288, 28, 180, 250, 55, 120, 315, 345];

function SocialIcon({ name }: { name: string }) {
  const key = name.toLowerCase();
  if (key.includes("github")) return <SiGithub className="w-4 h-4" />;
  if (key.includes("linkedin")) return <SiLinkedin className="w-4 h-4" />;
  if (key.includes("twitter") || key === "x") return <SiX className="w-4 h-4" />;
  if (key.includes("instagram")) return <SiInstagram className="w-4 h-4" />;
  if (key.includes("facebook")) return <SiFacebook className="w-4 h-4" />;
  if (key.includes("whatsapp")) return <SiWhatsapp className="w-4 h-4" />;
  if (key.includes("mail")) return <Mail className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
}

export default function Banner() {
  const { theme } = useTheme();
  const { hero, about, stats, contact, site } = useContent();
  const isDark = theme === "dark";
  const layout = hero.layout ?? "classic";
  const availability = hero.availabilityBadge || "Disponible pour nouveaux projets";
  const portraitSrc = hero.image || about.image || "barry.png";
  const portraitAlt = hero.imageAlt || `${hero.firstName} ${hero.lastName}`;
  const fullName = `${hero.firstName} ${hero.lastName}`.trim();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  const classicItemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
  };

  /* ── 2. CENTRÉ + CARTES FLOTTANTES (style Darwin) ──────────────────────── */
  if (layout === "centered") {
    const firstStat = stats.items[0];
    const secondStat = stats.items[1];
    return (
      <motion.section
        id="accueil"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative overflow-hidden min-h-[86vh] flex flex-col items-center justify-between pt-14 md:pt-20 px-4 ${
          isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Halo doux respectant la couleur principale */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse 70% 55% at 50% 18%, color-mix(in srgb, var(--color-amber-500) 16%, transparent), transparent 72%)"
              : "radial-gradient(ellipse 75% 60% at 50% 15%, color-mix(in srgb, var(--color-amber-500) 14%, transparent), transparent 72%)",
          }}
        />

        {/* Bloc texte centré */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {availability}
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08]"
          >
            {hero.greeting}{" "}
            <span className="text-amber-500">{hero.firstName}</span> {hero.lastName}
            <span className={`block mt-1 font-extrabold text-2xl sm:text-3xl md:text-4xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              — {hero.role}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className={`max-w-xl mx-auto text-base md:text-lg leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {hero.description}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <a
              href={hero.ctaHref || "#projets"}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25 transition-all"
            >
              {hero.ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-medium border transition-colors ${
                isDark
                  ? "border-gray-700 text-gray-200 hover:bg-gray-800"
                  : "border-gray-300 text-gray-800 hover:bg-gray-100"
              }`}
            >
              Me contacter
            </a>
          </motion.div>
        </div>

        {/* Portrait centré + cartes flottantes douces */}
        <div className="relative z-10 mt-10 w-full max-w-2xl flex items-end justify-center">
          <motion.div
            variants={imageVariants}
            className="relative w-64 sm:w-80 md:w-96 aspect-[4/4.3] flex items-end justify-center"
          >
            <div className="absolute inset-x-6 bottom-0 top-8 rounded-t-[2.5rem] bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/20" />
            <img
              src={portraitSrc}
              alt={portraitAlt}
              className="relative z-10 w-full h-full object-contain object-bottom drop-shadow-xl"
            />
          </motion.div>

          {/* Carte flottante gauche */}
          {firstStat && (
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.55 }}
              className={`hidden sm:flex items-center gap-3 absolute left-0 md:left-4 bottom-24 z-20 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${
                isDark ? "bg-gray-900/90 border-gray-700/80" : "bg-white/95 border-gray-200"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">
                  {firstStat.value}
                  {firstStat.suffix} {firstStat.label}
                </p>
                <div className="mt-1.5 h-1.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full w-4/5 rounded-full bg-amber-500" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Carte flottante droite */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.55 }}
            className={`hidden sm:flex items-start gap-3 absolute right-0 md:right-2 bottom-12 z-20 max-w-[230px] px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${
              isDark ? "bg-gray-900/90 border-gray-700/80" : "bg-white/95 border-gray-200"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-xs leading-snug">
              <p className="font-semibold">{secondStat ? `${secondStat.value}${secondStat.suffix} ${secondStat.label}` : "Web & Mobile"}</p>
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                Architecture propre, rapide et orientée produit.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  /* ── 3. ÉDITORIAL 3 COLONNES (style Mitchel Jonson) ────────────────────── */
  if (layout === "editorial") {
    const primaryStat = stats.items[0];
    const secondaryStat = stats.items[1];
    const visibleSocials = contact.socials.slice(0, 4);

    return (
      <motion.section
        id="accueil"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative min-h-[84vh] flex items-center py-14 px-4 sm:px-8 ${
          isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Colonne gauche */}
          <div className="lg:col-span-4 space-y-5 text-center lg:text-left">
            <motion.p variants={itemVariants} className={`text-lg font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {hero.greeting}
            </motion.p>
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl xl:text-6xl font-black uppercase tracking-tight leading-[0.98]"
            >
              <span className="block">{hero.firstName}</span>
              <span className="block text-amber-500">{hero.lastName}</span>
            </motion.h1>
            <motion.p variants={itemVariants} className={`text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {hero.description}
            </motion.p>
            <motion.div variants={itemVariants} className="pt-2">
              <a
                href={hero.ctaHref || "#projets"}
                className="inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all"
              >
                <span>{hero.ctaLabel}</span>
                <span className="w-9 h-9 rounded-full bg-gray-950 text-white flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </a>
            </motion.div>
          </div>

          {/* Colonne centrale : Carte portrait + réseaux + badge disponibilité */}
          <motion.div variants={imageVariants} className="lg:col-span-4 flex justify-center">
            <div
              className={`relative w-full max-w-sm rounded-3xl p-4 shadow-2xl border ${
                isDark ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-200/90"
              }`}
            >
              <div className={`relative rounded-2xl overflow-hidden aspect-[4/4.6] ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
                <img
                  src={portraitSrc}
                  alt={portraitAlt}
                  className="w-full h-full object-cover object-top"
                />

                {visibleSocials.length > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                    {visibleSocials.map((s) => (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="w-9 h-9 rounded-full bg-gray-900/75 hover:bg-amber-500 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                      >
                        <SocialIcon name={s.icon || s.label} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3.5 pb-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className={isDark ? "text-gray-200" : "text-gray-800"}>{availability}</span>
              </div>
            </div>
          </motion.div>

          {/* Colonne droite : Rôle + chiffres clés */}
          <div className="lg:col-span-4 space-y-6 text-center lg:text-left lg:pl-4">
            <motion.div variants={itemVariants} className="space-y-2 lg:border-l-2 lg:border-amber-500/60 lg:pl-5">
              <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {site.location || "Full-Stack Web & Mobile"}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight">
                {hero.role}
              </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 pt-2 max-w-xs mx-auto lg:mx-0">
              {primaryStat && (
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-gray-800/60 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
                  <p className="text-2xl font-black text-amber-500">
                    {primaryStat.value}
                    {primaryStat.suffix}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{primaryStat.label}</p>
                </div>
              )}
              {secondaryStat && (
                <div className={`p-4 rounded-2xl border ${isDark ? "bg-gray-800/60 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
                  <p className="text-2xl font-black text-amber-500">
                    {secondaryStat.value}
                    {secondaryStat.suffix}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{secondaryStat.label}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>
    );
  }

  /* ── 4. AFFICHE PORTFOLIO (style magazine poster) ──────────────────────── */
  if (layout === "poster") {
    return (
      <motion.section
        id="accueil"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative py-6 px-4 sm:px-6 ${isDark ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="relative max-w-7xl mx-auto min-h-[78vh] rounded-3xl overflow-hidden bg-[#141517] text-white flex flex-col justify-between p-6 sm:p-10 md:p-12 shadow-2xl border border-white/10">
          {/* Top bar */}
          <motion.div variants={itemVariants} className="relative z-20 flex items-center justify-between text-xs sm:text-sm text-gray-300">
            <span className="font-medium tracking-wide">{hero.role}</span>
            <a
              href={hero.ctaHref || "#projets"}
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              <span>{hero.ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Typographie géante PORTFOLIO derrière + portrait + contour devant */}
          <div className="relative my-auto py-8 flex items-center justify-center select-none">
            <motion.span
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              aria-hidden="true"
              className="text-[18vw] sm:text-[15vw] lg:text-[11.5rem] font-black tracking-tighter leading-none text-amber-400/90"
            >
              PORTFOLIO
            </motion.span>

            <motion.img
              src={portraitSrc}
              alt={portraitAlt}
              variants={imageVariants}
              className="absolute bottom-[-2.5rem] sm:bottom-[-3.5rem] h-[118%] max-h-[520px] w-auto object-contain z-10 drop-shadow-[0_24px_40px_rgba(0,0,0,0.65)]"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute z-20 text-[18vw] sm:text-[15vw] lg:text-[11.5rem] font-black tracking-tighter leading-none text-transparent"
              style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.45)" }}
            >
              PORTFOLIO
            </span>
          </div>

          {/* Bottom bar */}
          <motion.div variants={itemVariants} className="relative z-20 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-gray-300">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white">{fullName}</h1>
              <p className="text-xs text-gray-400">{availability}</p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors"
            >
              <Code2 className="w-4 h-4" />
              Me contacter
            </a>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  /* ── 5. MINIMALISTE (style STRATEGY éditorial épuré) ───────────────────── */
  if (layout === "minimal") {
    return (
      <motion.section
        id="accueil"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative overflow-hidden min-h-[84vh] flex flex-col justify-between pt-8 px-4 sm:px-8 ${
          isDark
            ? "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white"
            : "bg-gradient-to-b from-gray-100/80 via-white to-gray-50 text-gray-900"
        }`}
      >
        {/* Micro barre éditoriale en haut */}
        <motion.div
          variants={itemVariants}
          className={`max-w-5xl mx-auto w-full flex items-center justify-between text-xs sm:text-sm font-medium ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <span>{hero.firstName}</span>
          <span className="hidden sm:inline">{availability}</span>
          <span>{hero.lastName}</span>
        </motion.div>

        {/* Bloc titre minimaliste fort */}
        <div className="max-w-4xl mx-auto text-center pt-10 pb-6 space-y-3 z-10">
          <motion.p variants={itemVariants} className={`text-base sm:text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <span className="font-bold">{hero.greeting}</span> — {fullName}
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95]"
          >
            {hero.role}
            <span className="text-amber-500">.</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className={`max-w-xl mx-auto text-sm sm:text-base pt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {hero.description}
          </motion.p>
          <motion.div variants={itemVariants} className="pt-3">
            <a
              href={hero.ctaHref || "#projets"}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors"
            >
              {hero.ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Portrait épuré en bas */}
        <motion.div variants={imageVariants} className="relative max-w-md mx-auto w-full flex justify-center items-end pt-2">
          <img
            src={portraitSrc}
            alt={portraitAlt}
            className="w-64 sm:w-80 md:w-96 max-h-[420px] object-contain object-bottom drop-shadow-2xl"
          />
        </motion.div>
      </motion.section>
    );
  }

  /* ── 1. CLASSIQUE (bannière d'origine par défaut) ──────────────────────── */
  const techLogos = hero.techLogos
    .map((key, index) => {
      const def = LOGO_MAP[key.toLowerCase()];
      if (!def) return null;
      return {
        Icon: def.Icon,
        angle: ANGLES[index % ANGLES.length],
        color: isDark ? def.darkColor : def.lightColor,
      };
    })
    .filter((item): item is { Icon: IconType; angle: number; color: string } => item !== null);

  return (
    <motion.div
      id="accueil"
      className={`relative flex m-auto md:flex-row flex-col justify-center items-center min-h-[80vh] px-4 py-12 ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
            : "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div className="flex justify-center items-center flex-col p-4 z-10" variants={containerVariants}>
        <motion.a
          href={hero.ctaHref || "#projets"}
          variants={classicItemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded font-medium transition-colors bg-amber-500 hover:bg-amber-600 text-white"
        >
          <GiProgression />
          {hero.ctaLabel}
        </motion.a>

        <motion.h1 variants={classicItemVariants} className={`text-3xl ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {hero.greeting}
        </motion.h1>
        <motion.h2 variants={classicItemVariants} className={`md:text-5xl text-4xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>
          {hero.firstName} <span className="text-amber-500">{hero.lastName}</span>
        </motion.h2>
        <motion.h3 variants={classicItemVariants} className={isDark ? "text-gray-400" : "text-gray-600"}>
          {hero.role}
        </motion.h3>
        <motion.p variants={classicItemVariants} className={`max-w-lg text-lg leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {hero.description}
        </motion.p>
      </motion.div>

      <div className="relative flex items-center justify-center md:w-[40%] w-[80%] aspect-square z-10">
        <motion.img
          src={portraitSrc}
          alt={portraitAlt}
          variants={imageVariants}
          className={`object-contain w-full h-full ${isDark ? "bg-amber-500/20" : "bg-amber-400"}`}
        />

        {techLogos.map(({ Icon, angle, color }, index) => {
          const rad = (angle * Math.PI) / 180;
          const radius = 130;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          return (
            <motion.div
              key={index}
              style={{ position: "absolute", left: "50%", top: "50%" }}
              initial={{ opacity: 0, scale: 0, x: x - 20, y: y - 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: [x - 20, x - 26, x - 20],
                y: [y - 20, y - 26, y - 20],
              }}
              transition={{
                opacity: { delay: 1 + index * 0.15, duration: 0.4 },
                scale: { delay: 1 + index * 0.15, duration: 0.4, type: "spring" },
                x: { delay: 1 + index * 0.15, duration: 2.5 + index * 0.4, repeat: Infinity, ease: "easeInOut" },
                y: { delay: 1 + index * 0.15, duration: 2.5 + index * 0.4, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                  isDark ? "bg-gray-800/80 border border-gray-700" : "bg-white/90 border border-gray-200"
                }`}
              >
                <Icon size={22} color={color} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
