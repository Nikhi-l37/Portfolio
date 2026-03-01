export default function SectionHeader({ number, title }) {
  return (
    <h2 className="flex items-center gap-3 md:gap-3.5 text-heading text-xl md:text-3xl font-extrabold tracking-tight mb-8 md:mb-12">
      <span className="font-mono text-base font-medium bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">{number}.</span>
      {title}
      <span className="flex-1 h-px bg-gradient-to-r from-border to-transparent max-w-[300px]" />
    </h2>
  );
}
