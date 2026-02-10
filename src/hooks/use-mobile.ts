/**
 * Mobile Detection Hook
 *
 * This hook detects whether the current viewport is mobile-sized.
 * It uses a responsive approach that:
 * - Updates automatically when window resizes
 * - Uses modern matchMedia API for performance
 * - Returns false during server-side rendering (undefined state)
 *
 * The breakpoint (768px) follows Tailwind's md: breakpoint,
 * which is a common standard for mobile/tablet separation.
 *
 * Usage:
 *   const isMobile = useIsMobile()
 *   if (isMobile) {
 *     // Show mobile UI
 *   }
 */

import * as React from 'react'

// 768px matches Tailwind's md: breakpoint
// This means screens smaller than md are considered mobile
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Use matchMedia for efficient resize listening
    // This is more performant than window resize events
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Listen for media query changes
    mql.addEventListener('change', onChange)

    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup listener on unmount
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // Return false if undefined (during SSR) and ensure boolean return type
  return !!isMobile
}
