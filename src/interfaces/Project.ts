export default interface Project {
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
