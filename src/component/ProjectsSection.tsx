import ProjectCard from "./ProjetCard";
import { useTheme } from "../contexts/ThemeContext";

interface Project {
  id: string;
  title: string;
  description: string;
  mainImage: string; 
  images: string[]; // 2-3 images supplémentaires
  type: 'web' | 'mobile' | 'desktop' | 'other';
  liveUrl?: string; // URL pour visiter le projet (si app web)
  demoUrl?: string; // URL pour la démo (si applicable)
  technologies: string[];
  category: string;
}


interface ProjectsSectionProps {
    projects: Project[];
    onProjectClick: (project: Project) => void;
}

export default function ProjectsSection({ projects, onProjectClick }: ProjectsSectionProps) {
    const { theme } = useTheme();

    return (
        <div className={`flex md:flex-col w-full flex-col  p-6 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-transparent'
        }`} id="projets">
            <div className="text-center mb-12">
                <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">Portfolio</span>
                <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                    Mes réalisations
                </h2>
                <p className={`text-lg max-w-2xl mx-auto ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    Des projets qui témoignent de mon expertise et de ma créativité
                </p>
            </div>
            <div className="flex flex-col md:flex-row w-full gap-6 justify-center flex-wrap">
                {projects.map((project) => (
                    <ProjectCard 
                        key={project.id} 
                        project={project} 
                        onClick={() => onProjectClick(project)}
                    />
                ))}
            </div>
        </div>
    );
}
