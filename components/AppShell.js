export default function AppShell({ children }) {
  return (
    <div className="flex min-h-dvh items-stretch justify-center px-0 sm:px-4 sm:py-8">
      <div className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[var(--paper)] shadow-none sm:h-[min(860px,calc(100dvh-4rem))] sm:rounded-[32px] sm:border sm:border-[var(--line)] sm:shadow-[var(--shadow)]">
        {children}
      </div>
    </div>
  );
}
