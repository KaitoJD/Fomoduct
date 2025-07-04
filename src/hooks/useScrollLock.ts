import { useEffect, useRef } from 'react'

/**
 * Custom hook to lock/unlock body scroll
 * @param isLocked - Whether the scroll should be locked
 */
export const useScrollLock = (isLocked: boolean) => {
  const originalOverflowRef = useRef<string | null>(null)
  const hasModifiedRef = useRef<boolean>(false)

  useEffect(() => {
    if (isLocked) {
      // Store original overflow value only if we haven't stored it yet
      if (originalOverflowRef.current === null) {
        originalOverflowRef.current = document.body.style.overflow
      }
      
      // Lock scroll
      document.body.style.overflow = 'hidden'
      hasModifiedRef.current = true
      
      // Cleanup function to restore scroll
      return () => {
        if (hasModifiedRef.current && originalOverflowRef.current !== null) {
          document.body.style.overflow = originalOverflowRef.current
        }
      }
    } else {
      // If unlocked, restore original value if we had modified it
      if (hasModifiedRef.current && originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current
        hasModifiedRef.current = false
        originalOverflowRef.current = null
      }
    }
  }, [isLocked])
  
  // Cleanup on component unmount - only restore if we modified it
  useEffect(() => {
    return () => {
      if (hasModifiedRef.current && originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current
      }
    }
  }, [])
}
