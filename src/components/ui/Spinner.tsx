interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Chargement en cours' }: SpinnerProps) {
  return (
    <span className="text-ardoise-clair inline-flex items-center gap-2 text-sm">
      <span
        aria-hidden
        className="border-filet border-t-ambre h-4 w-4 animate-spin rounded-full border-2"
      />
      {label}
    </span>
  );
}
