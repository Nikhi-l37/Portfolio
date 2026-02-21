export default function SectionHeader({ number, title }) {
  return (
    <h2 className="flex items-center gap-3.5 text-heading text-2xl md:text-3xl font-extrabold tracking-tight mb-12">
      <span className="font-mono text-base font-medium text-accent">{number}.</span>
      {title}
      <span className="flex-1 h-px bg-border max-w-[300px]" />
    </h2>
  );
}
