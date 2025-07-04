import { useEffect } from 'react'

interface UseFocusTrapOptions {
  isEnabled: boolean
  containerSelector: string
  onEscape?: () => void
}

/**
 * Custom hook to manage focus trap within a container
 * @param options - Configuration options for focus trap
 */
export const useFocusTrap = ({ isEnabled, containerSelector, onEscape }: UseFocusTrapOptions) => {
  useEffect(() => {
    if (!isEnabled) return

    const container = document.querySelector(containerSelector)
    if (!container) return

    // Get all focusable elements within the container
    const focusableElements = container.querySelectorAll(
      'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape' && onEscape) {
        onEscape()
        return
      }

      // Handle Tab key for focus trap
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab - going backwards
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          // Tab - going forwards
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    // Auto focus first element when enabled
    const focusFirstElement = () => {
      requestAnimationFrame(() => {
        firstElement?.focus()
      })
    }

    // Set up event listener and initial focus
    document.addEventListener('keydown', handleKeyDown)
    focusFirstElement()

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEnabled, containerSelector, onEscape])
}
