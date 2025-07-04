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
    
    // Early return if no focusable elements found
    if (focusableElements.length === 0) {
      console.warn(`useFocusTrap: No focusable elements found in container "${containerSelector}"`)
      return
    }
    
    const firstElement = focusableElements[0] as HTMLElement

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape' && onEscape) {
        onEscape()
        return
      }

      // Handle Tab key for focus trap
      if (e.key === 'Tab') {
        // Ensure we still have focusable elements (they might have changed)
        const currentFocusableElements = container.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        
        if (currentFocusableElements.length === 0) return
        
        const currentFirstElement = currentFocusableElements[0] as HTMLElement
        const currentLastElement = currentFocusableElements[currentFocusableElements.length - 1] as HTMLElement
        
        if (e.shiftKey) {
          // Shift + Tab - going backwards
          if (document.activeElement === currentFirstElement) {
            e.preventDefault()
            currentLastElement?.focus()
          }
        } else {
          // Tab - going forwards
          if (document.activeElement === currentLastElement) {
            e.preventDefault()
            currentFirstElement?.focus()
          }
        }
      }
    }

    // Auto focus first element when enabled
    const focusFirstElement = () => {
      requestAnimationFrame(() => {
        // Double-check that element still exists and is focusable
        if (firstElement && typeof firstElement.focus === 'function') {
          try {
            firstElement.focus()
          } catch (error) {
            console.warn('useFocusTrap: Failed to focus first element', error)
          }
        }
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
