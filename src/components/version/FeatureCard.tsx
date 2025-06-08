import { Check } from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';

type FeatureCardProps = {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  hoverTextColor: string;
  iconColor: string;
  delay?: number;
  isNew?: boolean;
  decorativeColor: string;
};

export const FeatureCard = ({
  title,
  description,
  features,
  icon,
  gradientFrom,
  gradientTo,
  hoverTextColor,
  iconColor,
  delay = 0,
  isNew = false,
  decorativeColor
}: FeatureCardProps) => (
  <ScrollReveal delay={delay}>
    <div className="
      bg-white/80 dark:bg-white/5 
      backdrop-blur-md 
      rounded-2xl 
      overflow-hidden 
      border border-gray-200 dark:border-white/10 
      flex flex-col 
      group 
      hover:bg-white dark:hover:bg-white/10 
      transition-all duration-300 
      shadow-lg shadow-purple-900/5 dark:shadow-purple-900/10 
      hover:shadow-purple-900/20 dark:hover:shadow-purple-900/20 
      relative
    ">
      <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-${decorativeColor}/20 dark:from-${decorativeColor}/10 to-transparent rounded-bl-3xl`}></div>
      <div className={`absolute bottom-0 left-0 w-8 h-8 border-b border-l border-${decorativeColor}/20 dark:border-${decorativeColor}/10 rounded-tr-xl`}></div>

      <div className="p-8 relative">
        <div className={`
          w-12 h-12 
          bg-gradient-to-br from-${gradientFrom} to-${gradientTo} 
          rounded-xl 
          flex items-center justify-center 
          mb-6 
          shadow-lg shadow-${gradientFrom}/20 dark:shadow-${gradientFrom}/10 
          relative 
          overflow-hidden 
          group-hover:scale-110 
          transition-transform duration-300
        `}>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] opacity-0 group-hover:opacity-100 animate-shine"></div>
          {icon}
        </div>
        
        <h3 className={`
          text-gray-900 dark:text-white 
          text-xl font-bold mb-3 
          group-hover:text-${hoverTextColor} 
          transition-colors duration-300
        `}>
          {title}
          {isNew && (
            <span className={`
              ml-2 
              inline-flex items-center px-2.5 py-0.5 
              rounded-full text-xs font-medium 
              bg-${gradientFrom}/20 dark:bg-${gradientFrom}/10 
              text-${hoverTextColor}
            `}>
              New
            </span>
          )}
        </h3>
        
        <p className="text-gray-700 dark:text-white/60 mb-6">
          {description}
        </p>
        
        <ul className="space-y-2 mb-6">
          {features.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-white/70">
              <Check className={`h-4 w-4 text-${iconColor}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* <div className="mt-auto">
        <div className="h-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-[#170f3e] to-transparent z-10"></div>
          <img
            src="/placeholder.svg?height=400&width=600"
            alt={title}
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div> */}
    </div>
  </ScrollReveal>
);