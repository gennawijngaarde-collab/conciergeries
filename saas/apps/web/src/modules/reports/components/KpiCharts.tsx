import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const MONTHLY = [
  { month: 'Jan', adr: 118, revpar: 74, occupancy: 63 },
  { month: 'Feb', adr: 122, revpar: 81, occupancy: 66 },
  { month: 'Mar', adr: 130, revpar: 91, occupancy: 70 },
  { month: 'Apr', adr: 142, revpar: 105, occupancy: 74 },
  { month: 'May', adr: 155, revpar: 121, occupancy: 78 },
  { month: 'Jun', adr: 168, revpar: 139, occupancy: 83 },
];

/**
 * Stub KPI charts for ADR, RevPAR, and occupancy.
 * Replace `MONTHLY` with API data from useReports().
 */
export function KpiCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="panel">
        <h3 className="mb-1 text-sm font-semibold text-slate-900">ADR & RevPAR</h3>
        <p className="mb-4 text-xs text-slate-500">Average daily rate vs revenue per available room (€)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="adr" name="ADR" stroke="#114c09" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="revpar" name="RevPAR" stroke="#5fa852" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h3 className="mb-1 text-sm font-semibold text-slate-900">Occupancy</h3>
        <p className="mb-4 text-xs text-slate-500">Occupied nights / available nights (%)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="occupancy" name="Occupancy %" fill="#114c09" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
