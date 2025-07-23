import React, { forwardRef } from 'react'

export type NavButtonVariant = 'timer' | 'settings'
export type NavButtonStyle = 'nav-bar' | 'header' | 'header-dropdown'

interface NavButtonProps {
  variant: NavButtonVariant
  style: NavButtonStyle
  onClick: () => void
  className?: string
  isActive?: boolean
  ariaExpanded?: boolean
  ariaControls?: string
  ariaLabel?: string
  title?: string
}

// SVG path constants for better maintainability
const SETTINGS_GEAR_PATH = `
  M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 
  1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 
  2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 
  2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 
  1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 
  2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z
`.trim()

// Icon components for reusability
const TimerIcon: React.FC<{ style: NavButtonStyle }> = ({ style }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r={style === 'header' ? "10" : "9"} stroke="currentColor" strokeWidth="2"/>
    <path 
      d={style === 'header' ? "M12 6v6l4 2" : "M12 7v5l3 3"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {style !== 'header' && <circle cx="12" cy="12" r="1.5" fill="currentColor"/>}
  </svg>
)

const SettingsIcon: React.FC<{ style: NavButtonStyle }> = ({ style }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {style === 'header' ? (
      <>
        <path d="M12 15l3-3H9l3 3z" fill="currentColor"/>
        <path d="M12 9l3 3H9l3-3z" fill="currentColor"/>
      </>
    ) : (
      <>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        <path 
          d={SETTINGS_GEAR_PATH}
          stroke="currentColor" 
          strokeWidth="1.5"
        />
      </>
    )}
  </svg>
)

export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  ({
    variant,
    style,
    onClick,
    className = '',
    isActive = false,
    ariaExpanded,
    ariaControls,
    ariaLabel,
    title
  }, ref) => {
    // Generate default className based on style
    const getBaseClassName = () => {
      switch (style) {
        case 'nav-bar':
          return 'nav-bar-item'
        case 'header':
          return 'header-nav-item'
        case 'header-dropdown':
          return 'header-dropdown-item'
        default:
          return ''
      }
    }

    // Generate default aria-label if not provided
    const getDefaultAriaLabel = () => {
      if (ariaLabel) return ariaLabel

      switch (variant) {
        case 'timer':
          return 'Focus on Pomodoro Timer'
        case 'settings':
          return style === 'nav-bar' ? 'Open Settings Panel' : 'Settings'
        default:
          return undefined
      }
    }

    // Generate default title if not provided
    const getDefaultTitle = () => {
      if (title !== undefined) return title

      switch (variant) {
        case 'timer':
          return 'Timer'
        case 'settings':
          return 'Settings'
        default:
          return undefined
      }
    }

    // Get button text
    const getButtonText = () => {
      switch (variant) {
        case 'timer':
          return 'Timer'
        case 'settings':
          return 'Settings'
        default:
          return ''
      }
    }

    // Get additional variant-specific className
    const getVariantClassName = () => {
      if (style !== 'nav-bar') return ''

      const variantClass = variant === 'timer' ? 'timer-nav' : 'settings-nav'
      return isActive ? `${variantClass} active` : variantClass
    }

    const fullClassName = [
      getBaseClassName(),
      getVariantClassName(),
      className
    ].filter(Boolean).join(' ')

    const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
      type: 'button',
      className: fullClassName,
      onClick,
      'aria-label': getDefaultAriaLabel(),
      title: getDefaultTitle()
    }

    // Add conditional props
    if (ariaExpanded !== undefined) {
      buttonProps['aria-expanded'] = ariaExpanded
      buttonProps['aria-haspopup'] = true
    }
    if (ariaControls) {
      buttonProps['aria-controls'] = ariaControls
    }

    return (
      <button {...buttonProps} ref={ref}>
        {variant === 'timer' ? <TimerIcon style={style} /> : <SettingsIcon style={style} />}
        <span>{getButtonText()}</span>
      </button>
    )
  }
)
