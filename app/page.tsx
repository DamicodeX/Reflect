import { Button } from "@/components/ui/button"
import { Book, Calendar, ChevronRight, Sparkles, Lock, FileText, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/data/faq";
import { getDailyPrompt } from "@/actions/public";

const features = [
  {
    icon: Book,
    title: "Rich Text Editor",
    description:
      "Express yourself with a powerful editor supporting markdown, formatting, and more.",
  },
  {
    icon: Sparkles,
    title: "Daily Inspiration",
    description:
      "Get inspired with daily prompts and mood-based imagery to spark your creativity.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your thoughts are safe with enterprise-grade security and privacy features.",
  },
];

export default async function Home() {

  const dailyPrompt = await getDailyPrompt();
  const dailyPromptText = typeof dailyPrompt === "string" ? dailyPrompt : dailyPrompt?.advice;
  // console.log(advice, "Advice");

  return (
    <div className="relative container mx-auto px-4 pt-16 pb-16">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-3xl md:text-7xl lg:text-8xl mb-6 gradient-title">Your Space to Reflect. <br /> Your Story to Tell.</h1>
        <p className="text-lg md:text-xl text-orange-800 mb-8">
          Capture your thoughts, feelings, and track your moods with Reflect - your personal journal companion. <br />
        </p>
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-t from-orange-50 via-transparent to-transparent " />
          <div className="bg-white rounded-2xl p-4 max-full mx-auto">
            <div className="border-b border-orange-100 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-orange-400" />
                <span className="text-orange-900 font-medium">Today&apos;s Entry</span>
              </div>

              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-200" />
                <div className="h-3 w-3 rounded-full bg-orange-300" />
                <div className="h-3 w-3 rounded-full bg-orange-400" />
              </div>
            </div>

            <div className="space-y-4 p-4">
              <h3 className="text-xl font-semibold text-orange-900">{dailyPromptText ?? "Daily Prompts"}</h3>
              <Skeleton className="h-4 bg-orange-100 rounded w-3/4" />
              <Skeleton className="h-4 bg-orange-100 rounded w-full" />
              <Skeleton className="h-4 bg-orange-100 rounded w-2/3" />
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button variant="journal" className=" cursor-pointer px-8 py-6 rounded-full flex items-center gap-2">
              Start Writing <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" className=" cursor-pointer px-8 py-6 rounded-full border-orange-600 text-orange-600 hover:bg-orange-100">
              Learn More <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <section id="features" className="mt-24 md:mt-28">
        <div className="relative overflow-hidden rounded-3xl border border-orange-200/70 bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 p-6 md:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-orange-200/40 blur-2xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-amber-200/40 blur-2xl" />

          <div className="relative mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Why reflect</p>
              <h2 className="text-3xl font-bold tracking-tight text-orange-950 md:text-4xl">
                Thoughtful tools for your daily journaling ritual
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-orange-800/90 md:text-base">
              Built to keep writing simple, private, and consistent. Everything you need to make reflection part of your day.
            </p>
          </div>

          <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-orange-200/80 bg-white/85 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <CardContent className="p-6">
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 transition-colors duration-300 group-hover:bg-orange-600 group-hover:text-white">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-orange-950">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-orange-800 md:text-base">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="space-y-24 mt-24">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-orange-900">Rich Text Editor</h3>
            <p className="text'lg text-orange-700">Express yourself fully with our powerful editor featuring:</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                <span>Format text with ease</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                <span>Embed links</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4 bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            <div className="flex gap-2 mb-6">
              <div className="h-8 w-8 rounded bg-orange-100" />
              <div className="h-8 w-8 rounded bg-orange-100" />
              <div className="h-8 w-8 rounded bg-orange-100" />
            </div>
            <Skeleton className="h-4 bg-orange-50 rounded w-3/4" />
            <Skeleton className="h-4 bg-orange-50 rounded w-full" />
            <Skeleton className="h-4 bg-orange-50 rounded w-2/3" />
            <Skeleton className="h-4 bg-orange-50 rounded w-1/3" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:flex-row-reverse">
          <div className="space-y-4 bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            <div className="h-40 bg-linear-to-t from-orange-100 to-orange-50 rounded-lg"></div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16 bg-orange-100 rounded" />
              <Skeleton className="h-4 w-16 bg-orange-100 rounded" />
              <Skeleton className="h-4 w-16 bg-orange-100 rounded" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <BarChart2 className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-orange-900">Mood Analytics</h3>
            <p className="text'lg text-orange-700">Track your emotional journey with powerful analytics:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                <span>Visual mood trends</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                <span>Pattern recognition</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <TestimonialCarousel />

      <div className="mt-24">
        <h2 className="text-3xl font-bold text-center text-orange-900 mb-12">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full cursor-pointer mx-auto">
          {faqs.map((faq, index: number) => {
            return (
              <AccordionItem value={`item-${index}`} key={faq.q}>
                <AccordionTrigger className="text-orange-900 text-lg">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-orange-700">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            )
          })}

        </Accordion>
      </div>

      <div className="mt-24">
        <Card className="bg-linear-to-r from-orange-100 to-amber-100">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-orange-900 mb-6">
              Start Reflecting on your Journey Today
            </h2>
            <p className="text-lg text-orange-700 mb-8 max-w-2xl mx-auto">
              Join thousands of writers who have already discovered the power of digital journaling
            </p>

            <Link href="/dashboard">
              <Button size="lg" variant="journal" className="animate-bounce cursor-pointer">
                Get started for Free! <ChevronRight className="ml-2  h-4 w-4 " />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
