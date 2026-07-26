import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/shared/ui/PageHeader';
import { useMessages } from '../hooks/useMessages';

type Channel = 'AIRBNB' | 'BOOKING' | 'EMAIL' | 'WHATSAPP' | 'SMS' | 'INTERNAL';

type Thread = {
  id: string;
  guestName: string;
  propertyName: string;
  channel: Channel;
  preview: string;
  unread: boolean;
  updatedAt: string;
};

const DEMO_THREADS: Thread[] = [
  {
    id: '1',
    guestName: 'Camille Dupont',
    propertyName: 'Loft République',
    channel: 'AIRBNB',
    preview: 'Bonjour, à quelle heure pouvons-nous récupérer les clés ?',
    unread: true,
    updatedAt: '10:42',
  },
  {
    id: '2',
    guestName: 'James Carter',
    propertyName: 'Studio Bastille',
    channel: 'BOOKING',
    preview: 'Is early check-in possible on Friday?',
    unread: true,
    updatedAt: '09:15',
  },
  {
    id: '3',
    guestName: 'Sophie Martin',
    propertyName: 'Villa Arcachon',
    channel: 'WHATSAPP',
    preview: 'Le code du portail ne fonctionne plus…',
    unread: false,
    updatedAt: 'Hier',
  },
  {
    id: '4',
    guestName: 'Owner — M. Leroy',
    propertyName: 'Loft République',
    channel: 'EMAIL',
    preview: 'Merci pour le rapport mensuel.',
    unread: false,
    updatedAt: 'Lun.',
  },
];

const CHANNEL_STYLE: Record<Channel, string> = {
  AIRBNB: 'bg-rose-50 text-rose-700',
  BOOKING: 'bg-blue-50 text-blue-700',
  EMAIL: 'bg-slate-100 text-slate-700',
  WHATSAPP: 'bg-emerald-50 text-emerald-700',
  SMS: 'bg-violet-50 text-violet-700',
  INTERNAL: 'bg-amber-50 text-amber-800',
};

/**
 * Unified inbox across Airbnb, Booking, email, WhatsApp, SMS, and internal notes.
 */
export function InboxPage() {
  const { isError, error } = useMessages();
  const [selectedId, setSelectedId] = useState(DEMO_THREADS[0]?.id);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [draft, setDraft] = useState('');

  const threads = useMemo(() => {
    if (filter === 'unread') return DEMO_THREADS.filter((t) => t.unread);
    return DEMO_THREADS;
  }, [filter]);

  const selected = threads.find((t) => t.id === selectedId) ?? DEMO_THREADS[0];

  return (
    <div>
      <PageHeader
        title="Unified inbox"
        description="All guest and owner conversations in one place — channel badges and reply composer stub."
        actions={
          <Link to="/messages" className="btn-secondary">
            Messages home
          </Link>
        }
      />

      {isError ? (
        <p className="mb-3 text-sm text-amber-700">
          Messages API unavailable — demo inbox shown. {(error as Error)?.message}
        </p>
      ) : null}

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          type="button"
          className={filter === 'unread' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setFilter('unread')}
        >
          Unread
        </button>
      </div>

      <div className="grid min-h-[420px] overflow-hidden rounded-lg border border-slate-200 bg-white lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
          <ul className="divide-y divide-slate-100">
            {threads.map((thread) => (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(thread.id)}
                  className={`w-full px-3 py-3 text-left transition hover:bg-slate-50 ${
                    selected?.id === thread.id ? 'bg-brand-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`truncate text-sm ${thread.unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {thread.guestName}
                    </p>
                    <span className="shrink-0 text-[11px] text-slate-400">{thread.updatedAt}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{thread.propertyName}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${CHANNEL_STYLE[thread.channel]}`}>
                      {thread.channel}
                    </span>
                    <p className="truncate text-xs text-slate-500">{thread.preview}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex flex-col">
          {selected ? (
            <>
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="font-semibold text-slate-900">{selected.guestName}</p>
                <p className="text-xs text-slate-500">
                  {selected.propertyName} ·{' '}
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${CHANNEL_STYLE[selected.channel]}`}>
                    {selected.channel}
                  </span>
                </p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4">
                <div className="max-w-md rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                  {selected.preview}
                </div>
                <div className="ml-auto max-w-md rounded-lg bg-brand-800 px-3 py-2 text-sm text-white shadow-sm">
                  Merci pour votre message — nous revenons vers vous rapidement.
                </div>
              </div>
              <form
                className="flex gap-2 border-t border-slate-100 p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.info('[inbox] send stub', { threadId: selected.id, draft });
                  setDraft('');
                }}
              >
                <input
                  className="input-field"
                  placeholder="Write a reply…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button type="submit" className="btn-primary shrink-0" disabled={!draft.trim()}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
              Select a thread
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
