import { CompassIcon, HomeIcon } from "./Icons";

const tabs = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "discover", label: "Discover", Icon: CompassIcon },
];

export default function TabBar({ active, onChange }) {
  return (
    <nav
      className="grid grid-cols-2 border-t border-[var(--line)] bg-[var(--paper)] pb-[max(0.4rem,env(safe-area-inset-bottom))]"
      aria-label="Main"
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1 py-3 text-[11px] font-semibold tracking-wide transition-colors ${
              isActive ? "text-[var(--ink)]" : "text-[var(--muted)]"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon active={isActive} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
