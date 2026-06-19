import Link from "next/link";
import PulseLine from "@/components/ui/PulseLine";

export default function CTA() {
  return (
    <section className="container-shell pb-20 sm:pb-28">
      <div className="panel relative overflow-hidden px-8 py-14 text-center sm:px-14">
        <PulseLine
          tone="signal"
          className="absolute inset-x-0 top-0 h-16 w-full opacity-40"
        />
        <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl">
          The narrative is already rotating.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-mist-500">
          Open the dashboard to see what&apos;s driving the market right now, and what NarrativeX
          would do about it.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex rounded-full bg-signal-500 px-7 py-3 text-sm font-medium text-white shadow-glow transition hover:bg-signal-400"
        >
          Open the dashboard
        </Link>
      </div>
    </section>
  );
}
