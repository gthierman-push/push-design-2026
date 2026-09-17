/**
 * The shell every component page shares: a page title, then one block per
 * example — heading, a line on what the example shows, and the example itself
 * inside a bordered preview.
 */
export function DesignPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-xl font-medium">{title}</h1>
      {children}
    </div>
  );
}

export function Example({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-medium">{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
      {/* The preview is deliberately plain: a border and room to breathe, so
          the component inside is the only thing with styling to look at. */}
      <div className="flex min-h-[273px] flex-col justify-center rounded-md border p-6">
        {children}
      </div>
    </section>
  );
}
