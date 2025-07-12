import React from 'react'
import '../styles/NavigationBar.css'
import { NavButton } from './index'

interface NavigationBarProps {
  isMenuOpen: boolean
  onToggleMenu: () => void
  onTimerClick?: () => void
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  isMenuOpen,
  onToggleMenu,
  onTimerClick
}) => {
  return (
    <aside className={`navigation-bar ${isMenuOpen ? 'menu-open' : ''}`} role="navigation" aria-label="Sidebar navigation">
      <div className="nav-content">
        {/* Navigation Items */}
        <nav className="nav-items" aria-label="Main navigation">
          <NavButton
            variant="timer"
            style="nav-bar"
            onClick={() => onTimerClick && onTimerClick()}
          />

          <NavButton
            variant="settings"
            style="nav-bar"
            onClick={onToggleMenu}
            isActive={isMenuOpen}
            ariaExpanded={isMenuOpen}
            ariaControls="settings-menu"
          />
        </nav>
      </div>
    </aside>
  )
}
