export default function WidgetCard({ eyebrow, title, headerRight, children, className = "" }) {
  return (
    <div className={`panel flex flex-col p-6 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="label-eyebrow">{eyebrow}</span>
          <h3 className="mt-1.5 font-display text-lg font-semibold text-mist-100">{title}</h3>
        </div>
        {headerRight ? <div className="shrink-0">{headerRight}</div> : null}
      </div>
      <div className="mt-5 flex-1">{children}</div>
    </div>
  );
}
