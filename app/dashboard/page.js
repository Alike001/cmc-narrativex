import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StrategyDashboard from "@/components/dashboard/StrategyDashboard";

export const metadata = {
  title: "Strategy Board — CMC NarrativeX",
  description:
    "Live mock strategy board for narrative analysis, market regime, risk, and execution planning.",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-ink-900 bg-grid-fade">
      <DashboardHeader />
      <StrategyDashboard />
    </main>
  );
}
