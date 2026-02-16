import { motion } from "framer-motion";
import { GiProgression } from "react-icons/gi";
import { useTheme } from "../contexts/ThemeContext";

export default function Banner(){
    const { theme } = useTheme();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut'
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8, x: 30 },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut'
            }
        }
    };

    return(
        <motion.div 
            id="accueil" 
            className={`flex m-auto md:flex-row flex-col justify-center items-center min-h-[80vh] px-4 py-12 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div 
                className="flex justify-center items-center flex-col p-4"
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

            <motion.img 
                src="barry.png" 
                alt="" 
                variants={imageVariants}
                className={`object-contain md:w-[25%] ${
                    theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-400'
                }`}
            />
            
        </motion.div>
    )
}