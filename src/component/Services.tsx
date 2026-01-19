import Carte from "./Carte";
import { useTheme } from "../contexts/ThemeContext";

const services = [
    { title: 'Développement Web', description: 'Applications web modernes et responsives avec React, Next.js et TypeScript' },
    { title: 'Développement Mobile', description: 'Applications natives et cross-platform avec React Native et Flutter' },
    { title: 'Architecture & API', description: 'Conception d\'architectures scalables et développement d\'APIs RESTful' },
    { title: 'Consulting Tech', description: 'Accompagnement stratégique et optimisation de vos projets numériques' }
];

export default function Services() {
    const { theme } = useTheme();

    return (
        <section className={`py-20 px-4 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`} id="services">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">Services</span>
                    <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        Ce que je peux faire pour vous
                    </h2>
                    <p className={`text-lg max-w-2xl mx-auto ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        Des solutions sur mesure pour transformer vos idées en réalité digitale
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <Carte key={index} title={service.title} description={service.description} />
                    ))}
                </div>
            </div>
        </section>
    );
}
