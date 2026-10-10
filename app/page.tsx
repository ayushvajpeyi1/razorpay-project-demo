import { DashboardHeader, Sidebar, TestToolbar, Overview, TransactionTabs, SupportButton } from '@/components/dashboard';
export default function Page() { return <><DashboardHeader /><div className="dashboard-shell"><Sidebar /><main className="main-content"><TestToolbar /><Overview /><TransactionTabs /></main></div><SupportButton /></>; }
