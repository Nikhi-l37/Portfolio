export default function ProjectCard({ title, subtitle, description, tags, liveUrl, repoUrl, delay = 0 }) {
  return (
    <article
      className="group bg-card border border-border rounded-xl p-5 md:p-7 flex flex-col relative overflow-hidden
                 float-2 will-change-transform transition-[box-shadow,border-color,background-color] duration-300 ease-out
                 hover:border-border-hover hover:bg-card-hover
                 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_40px_var(--color-accent-dim)]"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-accent-alt scale-x-0 origin-left transition-transform duration-400 ease-out group-hover:scale-x-100" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <i className="fa-regular fa-folder-open text-4xl text-accent" />
        <div className="flex gap-3">
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener" aria-label="Live Demo"
               className="text-dim text-lg p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md transition-colors hover:text-accent hover:bg-accent-dim">
              <i className="fa-solid fa-arrow-up-right-from-square" />
            </a>
          )}
          {repoUrl && (
            <a href={repoUrl} target="_blank" rel="noopener" aria-label="GitHub Repo"
               className="text-dim text-lg p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md transition-colors hover:text-accent hover:bg-accent-dim">
              <i className="fa-brands fa-github" />
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <h3 className="text-xl font-bold text-heading mb-1">{title}</h3>
      <p className="text-sm text-accent font-medium mb-3">{subtitle}</p>
      <p className="text-[0.92rem] text-muted leading-relaxed flex-1 mb-5">{description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag}
            className="font-mono text-[0.72rem] text-dim px-2.5 py-1 bg-primary rounded-full border border-border
                       transition-[border-color,color] duration-300 group-hover:border-border-hover group-hover:text-accent">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
