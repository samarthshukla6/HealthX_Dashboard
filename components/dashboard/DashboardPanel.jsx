"use client";

export default function DashboardPanel({
  title,
  subtitle,
  action,
  children,
  className = "",
}) {
  return (
    <section
      className={`flex flex-col h-full min-h-0 rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden ${className}`}
    >
      <header className="flex-shrink-0 flex items-start justify-between gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/80">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900 truncate">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </header>
      <div className="flex-1 min-h-0 p-4">{children}</div>
    </section>
  );
}
