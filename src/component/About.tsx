import { FaPhone } from "react-icons/fa6";
import { useTheme } from "../contexts/ThemeContext";

export default function About(){
    const { theme } = useTheme();

    return (
        <section className={`py-20 px-4 m-auto max-w-6xl ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`} id="about">
            
            <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-shrink-0">
                    <img src="my_face.jpg" alt="Alhassane Barry" className="w-80 h-80 rounded object-cover"/>
                </div>
                <div className="flex flex-col gap-6 flex-1">
                    <div>
                        <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">À propos</span>
                        <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Créateur de solutions digitales innovantes
                        </h2>
                    </div>
                    <p className={`text-lg leading-relaxed ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Ingénieur informatique avec plus de 5 ans d'expérience dans le développement web et mobile. 
                        Je me spécialise dans la création d'applications performantes, scalables et centrées sur l'utilisateur. 
                        Mon approche combine expertise technique et compréhension des besoins métier pour livrer des solutions qui font la différence.
                    </p>
                    <p className={`text-lg leading-relaxed ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Passionné par les technologies modernes, je reste constamment à jour avec les dernières tendances 
                        et meilleures pratiques du développement logiciel.
                    </p>
                    <a 
                        href="#contact"
                        className="inline-flex items-center gap-2 px-6 py-3 w-fit rounded bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
                    >
                        <FaPhone /> Prendre contact
                    </a>
                </div>
            </div>

        </section>
    )
}