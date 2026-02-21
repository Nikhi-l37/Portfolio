import { useScrollReveal } from '../hooks/useScrollReveal';

export default function RevealWrapper({ children, className = '', delay = 0, threshold = 0.1 }) {
  const [ref, isVisible] = useScrollReveal(threshold);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-[50px]'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
