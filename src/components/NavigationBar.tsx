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
    <div className={`navigation-bar ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="nav-content">
        {/* Navigation Items */}
        <nav className="nav-items">
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
    </div>
  )
}
