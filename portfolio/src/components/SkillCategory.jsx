export default function SkillCategory({ icon, title, skills, delay = 0 }) {
  return (
    <div
      className="group h-full bg-card border border-border rounded-xl py-5 px-4 md:py-7 md:px-6 text-center
                 float-3 will-change-transform transition-[box-shadow,border-color] duration-300 ease-out
                 hover:border-border-hover
                 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Icon circle */}
      <div className="w-14 h-14 rounded-full bg-accent-dim flex items-center justify-center mx-auto mb-4
                      text-xl text-accent transition-[background-color,color,transform] duration-300 group-hover:bg-accent group-hover:text-primary group-hover:scale-110">
        <i className={icon} />
      </div>

      <h3 className="text-[1.05rem] font-bold text-heading mb-4">{title}</h3>

      <div className="flex flex-wrap justify-center gap-2">
        {skills.map((skill) => (
          <span key={skill}
            className="text-sm font-medium text-muted px-3.5 py-1.5 rounded-full bg-primary border border-border
                       transition-[border-color] duration-300 group-hover:border-border-hover">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
