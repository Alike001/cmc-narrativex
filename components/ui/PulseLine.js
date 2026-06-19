const TONE_COLORS = {
  signal: "#4F7CFF",
  pulse: "#00D9B5",
  amber: "#FFB020",
  danger: "#FF5C5C",
};

/**
 * The product's signature visual motif: a seismograph-style line that
 * represents a narrative's "pulse" through the market. Reused at hero scale
 * on the landing page and at a smaller scale inside dashboard widgets.
 */
export default function PulseLine({ tone = "signal", className = "" }) {
  const color = TONE_COLORS[tone] ?? TONE_COLORS.signal;

  return (
    <svg
      viewBox="0 0 240 40"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 20 H40 L52 6 L64 34 L76 14 L88 26 L100 20 H140 L152 4 L164 36 L176 12 L188 28 L200 20 H240"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulseLine"
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
    </svg>
  );
}
