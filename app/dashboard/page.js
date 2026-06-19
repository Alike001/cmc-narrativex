import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StrategyDashboard from "@/components/dashboard/StrategyDashboard";

export const metadata = {
  title: "Strategy Board — CMC NarrativeX Agent",
  description:
    "AI Narrative Rotation Agent for narrative analysis, market regime, risk, and portfolio decisioning.",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-ink-900 bg-grid-fade">
      <DashboardHeader />
      <StrategyDashboard />
    </main>
  );
}
