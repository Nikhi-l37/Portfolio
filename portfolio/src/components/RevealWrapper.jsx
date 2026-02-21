import { useScrollReveal } from '../hooks/useScrollReveal';

export default function RevealWrapper({ children, className = '', delay = 0, threshold = 0.1 }) {
  const [ref, isVisible] = useScrollReveal(threshold);

  return (
    <div
      ref={ref}
      className={`reveal${isVisible ? ' is-visible' : ''} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
