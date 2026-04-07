import { useCallback, useRef, useState } from "react"

interface UseInViewOptions {
  threshold?: number
  triggerOnce?: boolean
  rootMargin?: string
}

export function useInView({
  threshold = 0.2,
  triggerOnce = true,
  rootMargin = "0px 0px -50px 0px",
}: UseInViewOptions = {}) {
  const [inView, setInView] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback(
    (node: Element | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      if (!node) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            if (triggerOnce) observer.disconnect()
          } else if (!triggerOnce) {
            setInView(false)
          }
        },
        { threshold, rootMargin }
      )

      observer.observe(node)
      observerRef.current = observer
    },
    [threshold, triggerOnce, rootMargin]
  )

  return { ref, inView }
}
