import RevealWrapper from './RevealWrapper';
import SectionHeader from './SectionHeader';
import ProjectCard from './ProjectCard';

const PROJECTS = [
  {
    title: 'Finder',
    subtitle: 'Product Availability & Shop Status App',
    description:
      'Implemented OTP-based seller login & dashboard. Built product search with live shop open/close status using Node.js, Express, and Supabase.',
    tags: ['Node.js', 'Express', 'Supabase', 'OTP Auth', 'REST API'],
    liveUrl: 'https://finder-xjof.onrender.com',
  },
  {
    title: 'Resume Filter',
    subtitle: 'Prototype — Resume Screening System',
    description:
      'Developing a resume screening system to filter candidates by skills and criteria. Streamlines the hiring process with intelligent matching.',
    tags: ['Node.js', 'Express', 'Filtering', 'Full-Stack'],
    liveUrl: 'https://jeevanhackthon.onrender.com',
  },
  {
    title: 'Screen Tracker',
    subtitle: 'Android Screen Time & Habit Tracker',
    description:
      'Built an Android app to track screen time of selected apps, set usage rules, and generate streaks when users follow their limits.',
    tags: ['Android', 'Java', 'Screen Time', 'Habit Tracking'],
    repoUrl: 'https://github.com/Nikhi-I37/Screen-Tracker',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <RevealWrapper>
          <SectionHeader number="03" title="Projects" />
        </RevealWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <RevealWrapper key={project.title} delay={i * 120}>
              <ProjectCard {...project} />
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
