import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CurrentNarrativeWidget from "@/components/dashboard/CurrentNarrativeWidget";
import PreviousNarrativeWidget from "@/components/dashboard/PreviousNarrativeWidget";
import ConfidenceScoreWidget from "@/components/dashboard/ConfidenceScoreWidget";
import MarketRegimeWidget from "@/components/dashboard/MarketRegimeWidget";
import RiskScoreWidget from "@/components/dashboard/RiskScoreWidget";
import GeneratedStrategyWidget from "@/components/dashboard/GeneratedStrategyWidget";

export const metadata = {
  title: "Dashboard — CMC NarrativeX",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-ink-900 bg-grid-fade">
      <DashboardHeader />

      <div className="container-shell py-10">
        <div className="mb-8">
          <span className="label-eyebrow text-signal-400">Overview</span>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-mist-100 sm:text-3xl">
            Market narrative dashboard
          </h1>
          <p className="mt-2 max-w-lg text-sm text-mist-500">
            The current read across narrative, confidence, regime, risk, and the strategy
            generated from all four.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <CurrentNarrativeWidget />
          <ConfidenceScoreWidget />
          <MarketRegimeWidget />
          <RiskScoreWidget />
          <PreviousNarrativeWidget />
          <GeneratedStrategyWidget />
        </div>
      </div>
    </main>
  );
}
