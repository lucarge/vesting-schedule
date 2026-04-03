import {
  Sun,
  Moon,
  CalendarClock,
  BarChart3,
  FileSpreadsheet,
  TrendingUp,
  ArrowRight,
  ChartNoAxesCombined,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const features = [
  {
    icon: CalendarClock,
    title: "Vesting schedules",
    description:
      "Enter your grant details once and see exactly when each tranche vests. Supports cliffs, monthly and yearly cadences, and custom periods.",
  },
  {
    icon: BarChart3,
    title: "Milestone visualization",
    description:
      "Interactive charts break down your vesting timeline into clear milestones. See cumulative progress and what's coming next at a glance.",
  },
  {
    icon: FileSpreadsheet,
    title: "Multi-grant management",
    description:
      "Track multiple grants across different dates, strike prices, and vesting terms. Everything in one place, nothing to reconcile.",
  },
  {
    icon: TrendingUp,
    title: "Stock potential analysis",
    description:
      "Model future valuations and dilution scenarios to understand what your equity could actually be worth at various outcomes.",
  },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function toggle() {
    if (theme === "dark") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("dark")
    } else {
      const isDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
      setTheme(isDark ? "light" : "dark")
    }
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label="Toggle theme"
    >
      <Sun className="size-4 scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
    </button>
  )
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <ChartNoAxesCombined className="size-5" />
          <span className="text-sm font-semibold tracking-tight">
            VestWise
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative pt-14">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--muted)_0%,transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23808080' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-24 pt-24 sm:pb-32 sm:pt-32 md:pt-40 md:pb-40">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Stock option tracker
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your stock options,
            <br />
            finally clear.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            VestWise helps you understand your equity. Track vesting
            schedules, visualize milestones, and model what your options
            could be worth.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <a
              href="https://app.vestwise.app"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open app
              <ArrowRight className="size-4" />
            </a>
            <span className="text-xs text-muted-foreground">
              Free &middot; No sign-up required
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="border-t border-border/50">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="max-w-md">
          <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Features
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Everything you need to
            <br />
            track your equity
          </h2>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 bg-background p-8"
            >
              <feature.icon className="size-5 text-muted-foreground" />
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CallToAction() {
  return (
    <section className="border-t border-border/50">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Start tracking your vesting
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            No account needed. Your data stays in your browser. Open the
            app and add your first grant in under a minute.
          </p>
          <a
            href="https://app.vestwise.app"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open app
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ChartNoAxesCombined className="size-4" />
          <span className="text-xs font-medium">VestWise</span>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
