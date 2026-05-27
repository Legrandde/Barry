import { motion } from "framer-motion";
import { GiProgression } from "react-icons/gi";
import {
  SiGithub,
  SiDocker,
  SiDjango,
  SiLaravel,
  SiReact,
  SiTailwindcss
} from "react-icons/si";
import { useTheme } from "../contexts/ThemeContext";
import type { Variants } from "framer-motion";

export default function Banner(){
    const { theme } = useTheme();

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const imageVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    x: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const techLogos = [
  { Icon: SiGithub,      angle: 0,   color: theme === 'dark' ? '#ffffff' : '#24292e' },
  { Icon: SiDocker,      angle: 72,  color: '#2496ED' },
  { Icon: SiDjango,      angle: 144, color: theme === 'dark' ? '#44B78B' : '#092E20' },
  { Icon: SiLaravel,     angle: 216, color: '#FF2D20' },
  { Icon: SiReact,       angle: 288, color: '#007ACC' },
  { Icon: SiTailwindcss, angle: 28,  color: '#007ACC' },
];

    return(
        <motion.div 
            id="accueil" 
            className={`relative flex m-auto md:flex-row flex-col justify-center items-center min-h-[80vh] px-4 py-12 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Grille en arrière-plan */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: theme === 'dark'
                        ? 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)'
                        : 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            <motion.div 
                className="flex justify-center items-center flex-col p-4 z-10"
                variants={containerVariants}
            >
                <motion.a 
                    href="#projets"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded font-medium transition-colors ${
                        theme === 'dark' 
                            ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                >
                    <GiProgression />
                    Découvrir mes projets
                </motion.a>

                <motion.h1 
                    variants={itemVariants}
                    className={`text-3xl ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                >
                    Bonjour, je suis
                </motion.h1>
                <motion.h2 
                    variants={itemVariants}
                    className={`md:text-5xl text-4xl font-black ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                >
                    Alhassane <span className="text-amber-500">Barry</span>
                </motion.h2>
                <motion.h3 
                    variants={itemVariants}
                    className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                >
                    Développeur Full-stack
                </motion.h3>
                <motion.p 
                    variants={itemVariants}
                    className={`max-w-lg text-lg leading-relaxed ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                >
                    Passionné par le développement web et mobile, je transforme vos idées en solutions numériques performantes. Spécialisé en React, TypeScript et architectures modernes.
                </motion.p>
            </motion.div>

            {/* Wrapper relatif autour de l'image pour positionner les logos */}
            <div className="relative flex items-center justify-center md:w-[40%] w-[80%] aspect-square z-10">
                <motion.img 
                    src="barry.png" 
                    alt="" 
                    variants={imageVariants}
                    className={`object-contain w-full h-full ${
                        theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-400'
                    }`}
                />

                {techLogos.map(({ Icon, angle, color }, index) => {
                    const rad = (angle * Math.PI) / 180;
                    const radius = 130;
                    const x = Math.cos(rad) * radius;
                    const y = Math.sin(rad) * radius;
                    return (
                        <motion.div
                            key={index}
                            style={{ position: 'absolute', left: '50%', top: '50%' }}
                            initial={{ opacity: 0, scale: 0, x: x - 20, y: y - 20 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                x: [x - 20, x - 26, x - 20],
                                y: [y - 20, y - 26, y - 20],
                            }}
                            transition={{
                                opacity: { delay: 1 + index * 0.15, duration: 0.4 },
                                scale:   { delay: 1 + index * 0.15, duration: 0.4, type: 'spring' },
                                x: { delay: 1 + index * 0.15, duration: 2.5 + index * 0.4, repeat: Infinity, ease: 'easeInOut' },
                                y: { delay: 1 + index * 0.15, duration: 2.5 + index * 0.4, repeat: Infinity, ease: 'easeInOut' },
                            }}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                                theme === 'dark' ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/90 border border-gray-200'
                            }`}>
                                <Icon size={22} color={color} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            
        </motion.div>
    )
}