import RevealWrapper from './RevealWrapper';
import SectionHeader from './SectionHeader';
import SkillCategory from './SkillCategory';

const SKILLS = [
  { icon: 'fa-solid fa-palette', title: 'Frontend', skills: ['HTML5', 'CSS3', 'JavaScript'] },
  { icon: 'fa-solid fa-server', title: 'Backend', skills: ['Java', 'Node.js', 'Express.js', 'REST APIs', 'CRUD'] },
  { icon: 'fa-solid fa-database', title: 'Database', skills: ['Supabase', 'MongoDB Atlas', 'SQL'] },
  { icon: 'fa-solid fa-wrench', title: 'Tools & Platforms', skills: ['GitHub', 'Postman', 'Figma', 'Render'] },
  { icon: 'fa-solid fa-code', title: 'Concepts', skills: ['OOPs', 'SMTP', 'Nodemailer', 'HTTPS', 'Promises', 'Async/Await'] },
  { icon: 'fa-solid fa-trophy', title: 'Certifications', skills: ['UiPath AI Associate', 'CodeChef 500'] },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <RevealWrapper>
          <SectionHeader number="04" title="Skills & Expertise" />
        </RevealWrapper>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((category, i) => (
            <RevealWrapper key={category.title} delay={(i + 1) * 100}>
              <SkillCategory {...category} />
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
