import { DashboardHeader, Sidebar, SupportButton } from '@/components/dashboard';
import { Orchestrator } from '@/features/orchestrator/orchestrator';
export default function Page() { return <><DashboardHeader /><div className="dashboard-shell"><Sidebar orchestrator /><main className="main-content"><Orchestrator /></main></div><SupportButton /></>; }
