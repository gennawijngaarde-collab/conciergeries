import type { ReactNode } from 'react';
import { Check, Minus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AffiliateButton } from '@/components/tools/AffiliateButton';
import type { AirbnbTool } from '@/types/airbnbTool';

function CellBool({ value }: { value?: boolean }) {
  if (value === true) return <Check className="w-5 h-5 text-emerald-600 mx-auto" />;
  if (value === false) return <X className="w-5 h-5 text-red-400 mx-auto" />;
  return <Minus className="w-5 h-5 text-gray-300 mx-auto" />;
}

type Props = {
  tools: AirbnbTool[];
};

const rows: { key: string; label: string; render: (t: AirbnbTool) => ReactNode }[] = [
  { key: 'price', label: 'Prix', render: (t) => t.priceLabel },
  { key: 'trial', label: 'Essai gratuit', render: (t) => <CellBool value={t.freeTrial} /> },
  { key: 'mobile', label: 'Application mobile', render: (t) => <CellBool value={t.mobileApp} /> },
  { key: 'airbnb', label: 'Sync Airbnb', render: (t) => <CellBool value={t.syncAirbnb} /> },
  { key: 'booking', label: 'Sync Booking', render: (t) => <CellBool value={t.syncBooking} /> },
  { key: 'auto', label: 'Automatisation', render: (t) => <CellBool value={t.automation} /> },
  { key: 'support', label: 'Support', render: (t) => t.support ?? '—' },
  { key: 'api', label: 'API', render: (t) => <CellBool value={t.api} /> },
  { key: 'pay', label: 'Paiement', render: (t) => <CellBool value={t.payments} /> },
  {
    key: 'note',
    label: 'Note',
    render: (t) => <span className="font-semibold text-amber-600">{t.note.toFixed(1)}/5</span>,
  },
];

export function ToolsComparator({ tools }: Props) {
  if (tools.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left p-4 font-semibold text-gray-700 w-44">Critère</th>
            {tools.map((t) => (
              <th key={t.slug} className="p-4 text-center">
                <Link to={`/outils-airbnb/${t.slug}`} className="inline-flex flex-col items-center gap-2 group">
                  <img src={t.logo} alt="" className="w-10 h-10 rounded-lg object-contain bg-white border p-1" />
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600">{t.name}</span>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b last:border-0">
              <td className="p-4 font-medium text-gray-700">{row.label}</td>
              {tools.map((t) => (
                <td key={`${t.slug}-${row.key}`} className="p-4 text-center text-gray-800">
                  {row.render(t)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="p-4 font-medium text-gray-700">Essayer</td>
            {tools.map((t) => (
              <td key={`${t.slug}-cta`} className="p-4 text-center">
                <AffiliateButton toolSlug={t.slug} href={t.lienAffiliation} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Essayer
                </AffiliateButton>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
