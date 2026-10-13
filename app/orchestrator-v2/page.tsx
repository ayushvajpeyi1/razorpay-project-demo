import { DashboardHeader, Sidebar } from '@/components/dashboard';
import { RevenueCase } from '@/features/orchestrator-v2/revenue-case';

export const metadata = { title: 'Revenue Orchestrator V2 — Aster Living' };

export default function Page() {
  return <><DashboardHeader /><div className="dashboard-shell"><Sidebar orchestrator /><main className="main-content"><RevenueCase /></main></div></>;
}
