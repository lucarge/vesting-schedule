import { Check } from "lucide-react"
import { ScrollAnimate } from "@/components/scroll-animate"

const badges = [
  "100% Free",
  "No sign-up required",
  "Data stays in your browser",
]

export function TrustBadges() {
  return (
    <section className="border-t border-border/50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <ScrollAnimate>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {badges.map((badge, i) => (
              <div key={badge} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="mr-6 hidden text-border sm:inline">&middot;</span>
                )}
                <Check className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </ScrollAnimate>
      </div>
    </section>
  )
}
