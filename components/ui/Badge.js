const TONE_STYLES = {
  signal: "bg-signal-900/60 text-signal-400 border-signal-500/30",
  pulse: "bg-pulse-900/60 text-pulse-400 border-pulse-500/30",
  amber: "bg-amber-900/60 text-amber-400 border-amber-500/30",
  danger: "bg-danger-900/60 text-danger-400 border-danger-500/30",
  neutral: "bg-white/5 text-mist-300 border-white/10",
};

export default function Badge({ tone = "neutral", children }) {
  const style = TONE_STYLES[tone] ?? TONE_STYLES.neutral;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${style}`}
    >
      {children}
    </span>
  );
}
