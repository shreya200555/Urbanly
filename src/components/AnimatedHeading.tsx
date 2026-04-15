import { useState, useEffect } from 'react';

interface AnimatedHeadingProps {
  lines: string[];
  className?: string;
  initialDelay?: number;
  charDelay?: number;
  charDuration?: number;
}

export function AnimatedHeading({
  lines,
  className = '',
  initialDelay = 200,
  charDelay = 30,
  charDuration = 500,
}: AnimatedHeadingProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay]);

  return (
    <h1 className={className} style={{ letterSpacing: '-0.04em' }}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.split('').map((char, charIndex) => (
            <span
              key={`${lineIndex}-${charIndex}`}
              className="inline-block"
              style={{
                opacity: isAnimating ? 1 : 0,
                transform: isAnimating ? 'translateX(0)' : 'translateX(-18px)',
                transition: `opacity ${charDuration}ms ease-out, transform ${charDuration}ms ease-out`,
                transitionDelay: `${(lineIndex * line.length * charDelay) + (charIndex * charDelay)}ms`,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
