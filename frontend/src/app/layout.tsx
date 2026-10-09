import type { Metadata } from "next";
import { Suspense } from "react";
import { ReduxProvider } from "./providers";
import { Navbar } from "@/components/ui/Navbar";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: {
    template: "%s | FinishAI",
    default: "FinishAI — AI Execution Coach",
  },
  description:
    "Describe your goal, get a complete AI-powered roadmap with daily tasks, auto re-planning, and always know your next best action.",
  keywords: ["AI", "goal planning", "productivity", "execution coach", "task management"],
  openGraph: {
    title: "FinishAI — AI Execution Coach",
    description:
      "Describe your goal, get a complete AI-powered roadmap with daily tasks, auto re-planning, and always know your next best action.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <ReduxProvider>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            <main style={{ flex: 1 }}>
              <Suspense fallback={<div className="container" style={{ padding: "var(--space-12) 0", textAlign: "center" }}><div className="spinner spinner-md" /></div>}>
                {children}
              </Suspense>
            </main>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
