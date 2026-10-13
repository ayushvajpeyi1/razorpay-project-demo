import { DashboardHeader, Sidebar, Overview, TransactionTabs, SupportButton } from '@/components/dashboard';
export default function Page() { return <><DashboardHeader /><div className="dashboard-shell"><Sidebar /><main className="main-content"><Overview /><TransactionTabs /></main></div><SupportButton /></>; }
