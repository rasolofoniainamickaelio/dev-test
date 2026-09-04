import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

/** Un ecran vide est une invitation a agir, pas un constat d'absence. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="border-filet border-t px-4 py-10 text-center">
      <p className="font-medium">{title}</p>
      <p className="text-ardoise-clair prose-limite mx-auto mt-1 text-sm">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
