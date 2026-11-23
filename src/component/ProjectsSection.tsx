import ProjectCard from "./ProjetCard";
import { useTheme } from "../contexts/ThemeContext";
import { useContent } from "../contexts/content";
import type { ProjectItem } from "../types/content";

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onProjectClick: (project: ProjectItem) => void;
}

export default function ProjectsSection({ projects, onProjectClick }: ProjectsSectionProps) {
  const { theme } = useTheme();
  const { projects: section } = useContent();

  return (
    <div className={`flex md:flex-col w-full flex-col p-6 ${theme === "dark" ? "bg-gray-900" : "bg-transparent"}`} id="projets">
      <div className="text-center mb-12">
        <span className="text-sm font-semibold text-amber-500 uppercase tracking-wide">{section.eyebrow}</span>
        <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {section.title}
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {section.description}
        </p>
      </div>
      <div className="flex flex-col md:flex-row w-full gap-6 justify-center flex-wrap">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={() => onProjectClick(project)} />
        ))}
      </div>
    </div>
  );
}
