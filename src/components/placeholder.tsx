import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@components/ui/empty";

export function Placeholder({ title }: { title: string }) {
  return (
    <Empty className="border-border rounded-xl border border-dashed">
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          This page is a placeholder. Replace it with real content.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
