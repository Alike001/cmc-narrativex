import "./globals.css";

export const metadata = {
  title: "CMC NarrativeX Agent — AI Narrative Intelligence for Crypto Markets",
  description:
    "CMC NarrativeX Agent tracks which crypto narrative is driving the market right now, scores its confidence, reads the regime, and turns it into a strategy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
