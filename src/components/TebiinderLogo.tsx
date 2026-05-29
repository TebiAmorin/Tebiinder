/**
 * Tebiinder Logo — SVG crosshair + controller mashup
 * Represents the "matchmaking for R6 Siege players" concept:
 * a scope/crosshair (competitive R6) merged with a heart (finding your match).
 */
export default function TebiinderLogo({
  size = 44,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Tebiinder logo"
    >
      {/* Background rounded square — sticker style */}
      <rect x="4" y="4" width="92" height="92" rx="20" fill="#FF5A00" stroke="black" strokeWidth="6" />

      {/* Outer scope ring */}
      <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="5" />

      {/* Crosshair lines — top, bottom, left, right */}
      <line x1="50" y1="10" x2="50" y2="28" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="72" x2="50" y2="90" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <line x1="10" y1="50" x2="28" y2="50" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <line x1="72" y1="50" x2="90" y2="50" stroke="white" strokeWidth="5" strokeLinecap="round" />

      {/* Inner heart — the "matchmaking" symbol */}
      <path
        d="M50 62 C50 62 36 52 36 44 C36 39.5 39.5 36 44 36 C47 36 49 37.8 50 39.5 C51 37.8 53 36 56 36 C60.5 36 64 39.5 64 44 C64 52 50 62 50 62Z"
        fill="#00F5D4"
        stroke="black"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Center dot */}
      <circle cx="50" cy="47" r="3" fill="white" />
    </svg>
  );
}
