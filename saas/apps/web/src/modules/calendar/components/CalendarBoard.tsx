import { Fragment, useMemo, useState, type DragEvent } from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import type { CalendarEvent } from '../hooks/useCalendar';

export type CalendarView = 'day' | 'week' | 'month' | 'year';

type LegendItem = {
  key: string;
  label: string;
  className: string;
};

const LEGEND: LegendItem[] = [
  { key: 'reservation', label: 'Réservation', className: 'bg-brand-600' },
  { key: 'block', label: 'Blocage', className: 'bg-slate-500' },
  { key: 'cleaning', label: 'Ménage', className: 'bg-sky-500' },
];

const TONE: Record<string, string> = {
  reservation: 'bg-brand-600',
  booking: 'bg-brand-600',
  block: 'bg-slate-500',
  owner: 'bg-slate-500',
  cleaning: 'bg-sky-500',
  maintenance: 'bg-amber-500',
};

type CalendarBoardProps = {
  events?: CalendarEvent[];
  propertyNames?: Record<string, string>;
};

function eventType(ev: CalendarEvent): string {
  const raw = String(ev.type || ev.reason || 'reservation').toLowerCase();
  if (raw.includes('clean')) return 'cleaning';
  if (raw.includes('block') || raw.includes('manual') || raw.includes('owner')) return 'block';
  if (raw.includes('maint')) return 'maintenance';
  return 'reservation';
}

function eventStart(ev: CalendarEvent): Date | null {
  const raw = ev.startDate || ev.start;
  if (!raw) return null;
  try {
    return startOfDay(parseISO(String(raw).slice(0, 10)));
  } catch {
    return null;
  }
}

function eventEnd(ev: CalendarEvent): Date | null {
  const raw = ev.endDate || ev.end || ev.startDate || ev.start;
  if (!raw) return null;
  try {
    return startOfDay(parseISO(String(raw).slice(0, 10)));
  } catch {
    return null;
  }
}

/**
 * Guesty-like multi-view calendar board.
 * Accepts live events from the API when provided.
 */
export function CalendarBoard({ events = [], propertyNames = {} }: CalendarBoardProps) {
  const [view, setView] = useState<CalendarView>('month');
  const [anchor, setAnchor] = useState(() => new Date());
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const propertyIds = useMemo(() => {
    const ids = new Set<string>();
    for (const ev of events) {
      if (ev.propertyId) ids.add(String(ev.propertyId));
      if (ev.property?.id) ids.add(String(ev.property.id));
    }
    Object.keys(propertyNames).forEach((id) => ids.add(id));
    return Array.from(ids);
  }, [events, propertyNames]);

  const rows = propertyIds.length
    ? propertyIds
    : Object.keys(propertyNames).length
      ? Object.keys(propertyNames)
      : ['—'];

  const days = useMemo(() => {
    if (view === 'day') return [anchor];
    if (view === 'week') {
      const start = startOfWeek(anchor, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end: endOfWeek(anchor, { weekStartsOn: 1 }) });
    }
    if (view === 'month') {
      const start = startOfWeek(startOfMonth(anchor), { weekStartsOn: 1 });
      const end = endOfWeek(endOfMonth(anchor), { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }
    const yearStart = startOfYear(anchor);
    return Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));
  }, [anchor, view]);

  const label = useMemo(() => {
    if (view === 'day') return format(anchor, 'EEEE d MMMM yyyy', { locale: fr });
    if (view === 'week') {
      return `Semaine du ${format(startOfWeek(anchor, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: fr })}`;
    }
    if (view === 'month') return format(anchor, 'MMMM yyyy', { locale: fr });
    return format(anchor, 'yyyy');
  }, [anchor, view]);

  function shift(dir: -1 | 1) {
    setAnchor((d) => {
      if (view === 'day') return addDays(d, dir);
      if (view === 'week') return addWeeks(d, dir);
      if (view === 'month') return addMonths(d, dir);
      return addYears(d, dir);
    });
  }

  function eventsForCell(propertyKey: string, day: Date) {
    return events.filter((ev) => {
      const pid = String(ev.propertyId || ev.property?.id || '');
      if (pid && pid !== propertyKey) return false;
      const start = eventStart(ev);
      const end = eventEnd(ev);
      if (!start || !end) return false;
      try {
        return isWithinInterval(day, { start, end });
      } catch {
        return false;
      }
    });
  }

  function onDragStart(e: DragEvent, payload: string) {
    e.dataTransfer.setData('text/plain', payload);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDrop(e: DragEvent, cellKey: string) {
    e.preventDefault();
    const payload = e.dataTransfer.getData('text/plain');
    setDragOverKey(null);
    console.info('[calendar] drop', { payload, cellKey });
  }

  const monthList = useMemo(() => {
    if (view !== 'month') return [];
    const start = startOfMonth(anchor);
    const end = endOfMonth(anchor);
    return events.filter((ev) => {
      const s = eventStart(ev);
      const e = eventEnd(ev);
      if (!s || !e) return false;
      return s <= end && e >= start;
    });
  }, [events, anchor, view]);

  return (
    <div className="space-y-4">
      <div className="panel space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <button type="button" className="btn-secondary px-2" onClick={() => shift(-1)} aria-label="Précédent">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" className="btn-secondary px-2" onClick={() => shift(1)} aria-label="Suivant">
              <ChevronRight className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-semibold capitalize text-slate-900">{label}</h2>
            <button type="button" className="btn-secondary ml-2 text-xs" onClick={() => setAnchor(new Date())}>
              Aujourd&apos;hui
            </button>
          </div>

          <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5">
            {(
              [
                ['day', 'Jour'],
                ['week', 'Semaine'],
                ['month', 'Mois'],
                ['year', 'Année'],
              ] as const
            ).map(([v, text]) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`rounded px-3 py-1.5 text-xs font-medium ${
                  view === v ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-b border-slate-100 pb-3">
          {LEGEND.map((item) => (
            <div key={item.key} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className={`h-2.5 w-2.5 rounded-sm ${item.className}`} />
              {item.label}
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <div
            className="min-w-[720px] grid gap-px bg-slate-200"
            style={{ gridTemplateColumns: `160px repeat(${days.length}, minmax(72px, 1fr))` }}
          >
            <div className="bg-slate-50 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Logement
            </div>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className="bg-slate-50 px-1 py-2 text-center text-[11px] font-medium text-slate-600"
              >
                {view === 'year' ? format(day, 'MMM', { locale: fr }) : format(day, view === 'month' ? 'd' : 'EEE d', { locale: fr })}
              </div>
            ))}

            {rows.map((propertyKey) => (
              <Fragment key={propertyKey}>
                <div className="flex items-center gap-1 bg-white px-3 py-3 text-sm font-medium text-slate-800">
                  <GripVertical className="h-3.5 w-3.5 text-slate-300" />
                  {propertyNames[propertyKey] || propertyKey}
                </div>
                {days.map((day) => {
                  const cellKey = `${propertyKey}:${format(day, 'yyyy-MM-dd')}`;
                  const cellEvents = view === 'year' ? [] : eventsForCell(propertyKey, startOfDay(day));

                  return (
                    <div
                      key={cellKey}
                      className={`min-h-[56px] bg-white p-1 transition ${
                        dragOverKey === cellKey ? 'ring-2 ring-inset ring-brand-500' : ''
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverKey(cellKey);
                      }}
                      onDragLeave={() => setDragOverKey((k) => (k === cellKey ? null : k))}
                      onDrop={(e) => onDrop(e, cellKey)}
                    >
                      {cellEvents.length ? (
                        <div className="space-y-0.5">
                          {cellEvents.slice(0, 2).map((ev) => {
                            const tone = TONE[eventType(ev)] || TONE.reservation;
                            const text = ev.title || ev.notes || eventType(ev);
                            return (
                              <div
                                key={ev.id}
                                draggable
                                onDragStart={(e) => onDragStart(e, String(text))}
                                className={`cursor-grab rounded px-1.5 py-1 text-[10px] font-medium text-white active:cursor-grabbing ${tone}`}
                                title={String(text)}
                              >
                                {String(text).slice(0, 18)}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="h-full rounded border border-dashed border-transparent hover:border-slate-200" />
                      )}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {view === 'month' ? (
        <div className="panel">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Événements du mois</h3>
          {monthList.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun événement ce mois-ci.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {monthList.map((ev) => {
                const tone = TONE[eventType(ev)] || TONE.reservation;
                const pid = String(ev.propertyId || ev.property?.id || '');
                return (
                  <li key={ev.id} className="flex items-start gap-3 py-2.5 text-sm">
                    <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-sm ${tone}`} />
                    <div>
                      <p className="font-medium text-slate-900">
                        {ev.title || ev.notes || eventType(ev)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {propertyNames[pid] || pid || '—'} ·{' '}
                        {formatDateRange(ev.startDate || ev.start, ev.endDate || ev.end)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

function formatDateRange(start?: string, end?: string): string {
  if (!start) return '—';
  const s = String(start).slice(0, 10);
  const e = end ? String(end).slice(0, 10) : s;
  return e && e !== s ? `${s} → ${e}` : s;
}
