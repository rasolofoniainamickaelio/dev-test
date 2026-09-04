import { Field, fieldAria } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { RESERVATION_STATUS_META } from '@/lib/statusMeta';
import { RESERVATION_STATUSES } from '@/types';
import type { ReservationStatus } from '@/types';
import { ALL_STATUSES, type StatusFilter } from '../hooks/useFilteredReservations';

interface ReservationFiltersProps {
  status: StatusFilter;
  search: string;
  onStatusChange: (status: StatusFilter) => void;
  onSearchChange: (search: string) => void;
}

function isReservationStatus(value: string): value is ReservationStatus {
  return RESERVATION_STATUSES.some((status) => status === value);
}

export function ReservationFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: ReservationFiltersProps) {
  return (
    <div className="grid gap-4 py-4 sm:grid-cols-[12rem_1fr]">
      <Field id="filter-status" label="Statut">
        <Select
          {...fieldAria('filter-status', false, false)}
          value={status}
          onChange={(event) => {
            const next = event.target.value;
            onStatusChange(isReservationStatus(next) ? next : ALL_STATUSES);
          }}
        >
          <option value={ALL_STATUSES}>Tous les statuts</option>
          {RESERVATION_STATUSES.map((item) => (
            <option key={item} value={item}>
              {RESERVATION_STATUS_META[item].label}
            </option>
          ))}
        </Select>
      </Field>

      <Field id="filter-search" label="Rechercher">
        <Input
          {...fieldAria('filter-search', false, false)}
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Nom du client ou reference"
        />
      </Field>
    </div>
  );
}
