import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Hero } from "@/components/site/Hero";
import { Schedule } from "@/components/site/Schedule";
import { Trust } from "@/components/site/Trust";
import { Testimonials } from "@/components/site/Testimonials";
import { Logistics } from "@/components/site/Logistics";
import { RepeatCTA } from "@/components/site/RepeatCTA";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alex Moreno — Strength & Conditioning Coach · Barcelona" },
      {
        name: "description",
        content:
          "1-on-1 strength and conditioning in Barcelona. Studio sessions in Poblenou and outdoor training across Ciutadella, Montjuïc and Barceloneta. Book your session.",
      },
      { property: "og:title", content: "Alex Moreno — S&C Coach · Barcelona" },
      {
        property: "og:description",
        content:
          "Structured, efficient 1-on-1 training. Studio + outdoor sessions across Barcelona.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main>
        <Hero />
        <Schedule />
        <Trust />
        <Testimonials />
        <Logistics />
        <RepeatCTA />
      </main>
      <Footer />
    </div>
  );
}
