import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';
import { PropertiesPage } from '@/modules/properties/pages/PropertiesPage';
import { PropertyDetailPage } from '@/modules/properties/pages/PropertyDetailPage';
import { PropertyFormPage } from '@/modules/properties/pages/PropertyFormPage';
import { ReservationsPage } from '@/modules/reservations/pages/ReservationsPage';
import { CalendarPage } from '@/modules/calendar/pages/CalendarPage';
import { GuestsPage } from '@/modules/guests/pages/GuestsPage';
import { PaymentsPage } from '@/modules/payments/pages/PaymentsPage';
import { InvoicesPage } from '@/modules/invoices/pages/InvoicesPage';
import { ContractsPage } from '@/modules/contracts/pages/ContractsPage';
import { EmployeesPage } from '@/modules/employees/pages/EmployeesPage';
import { CleaningPage } from '@/modules/cleaning/pages/CleaningPage';
import { MaintenancePage } from '@/modules/maintenance/pages/MaintenancePage';
import { CheckinPage } from '@/modules/checkin/pages/CheckinPage';
import { CheckoutPage } from '@/modules/checkout/pages/CheckoutPage';
import { InventoryPage } from '@/modules/inventory/pages/InventoryPage';
import { MessagesPage } from '@/modules/messages/pages/MessagesPage';
import { InboxPage } from '@/modules/messages/pages/InboxPage';
import { ReportsPage } from '@/modules/reports/pages/ReportsPage';
import { SettingsPage } from '@/modules/settings/pages/SettingsPage';
import { CrmPage } from '@/modules/crm/pages/CrmPage';
import { PricingPage } from '@/modules/pricing/pages/PricingPage';
import { AutomationsPage } from '@/modules/automations/pages/AutomationsPage';
import { ChannelsPage } from '@/modules/channels/pages/ChannelsPage';
import { useAuth } from '@/shared/auth/AuthProvider';

export function App() {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Chargement…
      </div>
    );
  }

  if (!accessToken) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/new" element={<PropertyFormPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
          <Route path="properties/:id/edit" element={<PropertyFormPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="guests" element={<GuestsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="cleaning" element={<CleaningPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="checkin" element={<CheckinPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/inbox" element={<InboxPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="crm" element={<CrmPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="automations" element={<AutomationsPage />} />
          <Route path="channels" element={<ChannelsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
