import { Footer } from "@/components/Footer";

interface PageShellProps {
  kicker: string;
  heading: string;
  description: React.ReactNode;
  children?: React.ReactNode;
  wide?: boolean;
  showFooter?: boolean;
  header?: React.ReactNode;
}

export function PageShell({
  kicker,
  heading,
  description,
  children,
  wide,
  showFooter = true,
  header,
}: PageShellProps): React.JSX.Element {
  return (
    <div className="app-shell flex min-h-screen flex-col">
      <main className="flex-1 px-6 py-24 sm:px-8 lg:px-10">
        <article
          className={`container-shell ${wide ? "max-w-5xl" : "max-w-3xl"}`}
        >
          {header ?? (
            <>
              <p className="section-kicker mb-4 text-xs font-semibold uppercase text-muted">
                {kicker}
              </p>
              <h1 className="text-balance text-4xl font-semibold tracking-tighter text-primary sm:text-5xl">
                {heading}
              </h1>
              <p className="mt-6 text-lg leading-8 text-secondary">
                {description}
              </p>
            </>
          )}
          {children}
        </article>
      </main>
      {showFooter ? <Footer /> : null}
    </div>
  );
}
