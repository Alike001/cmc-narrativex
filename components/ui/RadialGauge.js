"use client";

const TONE_COLORS = {
  signal: "#4F7CFF",
  pulse: "#00D9B5",
  amber: "#FFB020",
  danger: "#FF5C5C",
};

/**
 * Circular progress gauge used for confidence + risk scores.
 * score: 0-100
 */
export default function RadialGauge({ score, tone = "signal", size = 132, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;
  const color = TONE_COLORS[tone] ?? TONE_COLORS.signal;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: `drop-shadow(0 0 8px ${color}55)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold text-mist-100">{clamped}</span>
        <span className="label-eyebrow text-mist-500">/ 100</span>
      </div>
    </div>
  );
}
