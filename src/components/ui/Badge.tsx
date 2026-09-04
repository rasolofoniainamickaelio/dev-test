import type { BadgeTone } from '@/lib/statusMeta';

const TONE_CLASSES: Record<BadgeTone, string> = {
  attente: 'bg-ambre-clair text-ardoise',
  confirme: 'bg-vert-clair text-vert-route',
  annule: 'bg-rouge-clair text-rouge-signal',
  termine: 'bg-fond-alt text-ardoise-clair',
  neutre: 'bg-fond-alt text-ardoise-clair',
};

const DOT_CLASSES: Record<BadgeTone, string> = {
  attente: 'bg-ambre',
  confirme: 'bg-vert-route',
  annule: 'bg-rouge-signal',
  termine: 'bg-ardoise-clair',
  neutre: 'bg-ardoise-clair',
};

interface BadgeProps {
  tone: BadgeTone;
  label: string;
}

/** La pastille est decorative : l'information reste portee par le libelle ecrit. */
export function Badge({ tone, label }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-sm font-medium ${TONE_CLASSES[tone]}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[tone]}`} />
      {label}
    </span>
  );
}
