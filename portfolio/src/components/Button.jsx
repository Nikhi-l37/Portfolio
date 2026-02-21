export default function Button({ children, href, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center gap-2.5 px-7 py-3.5 text-[0.95rem] font-semibold rounded-lg cursor-pointer transition-all duration-300 ease-out';

  const variants = {
    primary:
      'bg-accent text-primary shadow-[0_0_20px_var(--color-accent-dim)] hover:bg-white hover:text-primary hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] hover:-translate-y-0.5',
    outline:
      'bg-transparent text-accent border-[1.5px] border-accent hover:bg-accent-dim hover:-translate-y-0.5',
  };

  const Tag = href ? 'a' : 'button';
  const linkProps = href ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: 'noopener' } : {};

  return (
    <Tag className={`${base} ${variants[variant]} ${className}`} {...linkProps} {...props}>
      {children}
    </Tag>
  );
}
