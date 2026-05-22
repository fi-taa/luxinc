export function JournalGeometricPattern() {
  return (
    <div
      className="pointer-events-none absolute top-1/2 right-0 z-0 h-[min(100%,480px)] w-full max-w-[420px] -translate-y-1/2 translate-x-[25%] opacity-[0.18] lg:translate-x-[30%]"
      aria-hidden
    >
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full text-zulu-gold"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="currentColor" strokeWidth="0.6">
          <rect
            x="52"
            y="52"
            width="296"
            height="296"
            transform="rotate(45 200 200)"
          />
          <rect
            x="72"
            y="72"
            width="256"
            height="256"
            transform="rotate(45 200 200)"
          />
          <rect
            x="92"
            y="92"
            width="216"
            height="216"
            transform="rotate(45 200 200)"
          />
          <rect
            x="112"
            y="112"
            width="176"
            height="176"
            transform="rotate(45 200 200)"
          />
          <rect
            x="132"
            y="132"
            width="136"
            height="136"
            transform="rotate(45 200 200)"
          />
          <line x1="200" y1="24" x2="200" y2="376" />
          <line x1="24" y1="200" x2="376" y2="200" />
          <line x1="68" y1="68" x2="332" y2="332" />
          <line x1="332" y1="68" x2="68" y2="332" />
          <line x1="120" y1="48" x2="280" y2="352" />
          <line x1="280" y1="48" x2="120" y2="352" />
          <line x1="48" y1="120" x2="352" y2="280" />
          <line x1="352" y1="120" x2="48" y2="280" />
          <polygon points="200,32 368,200 200,368 32,200" />
          <polygon points="200,72 328,200 200,328 72,200" />
        </g>
      </svg>
    </div>
  );
}
