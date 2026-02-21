import { useState } from 'react';
import { useTypewriterPlaceholder } from '../hooks/useTypewriterPlaceholder';

/**
 * Drop-in replacement for <input> / <textarea> that shows an animated
 * typewriter placeholder with a blinking cursor.
 *
 * Props:
 *   phrases  – string[] of placeholder phrases to cycle through
 *   as       – 'input' (default) or 'textarea'
 *   All other props are forwarded to the underlying element.
 */
export default function TypewriterInput({
  phrases,
  as: Tag = 'input',
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const active = !focused && !hasValue;
  const text = useTypewriterPlaceholder(phrases, active);

  return (
    <div className="relative">
      <Tag
        className={className}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setHasValue(e.target.value.length > 0)}
        {...props}
      />
      {active && (
        <span className="absolute left-4 top-3.5 pointer-events-none text-dim text-[0.95rem] font-sans select-none">
          {text}
          <span className="inline-block w-[2px] h-[1.1em] bg-accent ml-px align-text-bottom animate-[blink-caret_0.75s_step-end_infinite]" />
        </span>
      )}
    </div>
  );
}
