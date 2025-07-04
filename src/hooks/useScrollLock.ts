import { useEffect } from 'react'

/**
 * Custom hook to lock/unlock body scroll
 * @param isLocked - Whether the scroll should be locked
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow
      
      // Lock scroll
      document.body.style.overflow = 'hidden'
      
      // Cleanup function to restore scroll
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isLocked])
  
  // Also cleanup on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])
}
