import React from 'react';
import '../styles/Dock.css';
import { NavButton } from './index';

interface DockProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onTimerClick?: () => void;
}

export const Dock: React.FC<DockProps> = ({ isMenuOpen, onToggleMenu, onTimerClick }) => {
  return (
    <nav className="dock-nav" role="navigation" aria-label="Bottom dock navigation">
      <div className="dock-content">
        <NavButton
          variant="timer"
          style="nav-bar"
          onClick={() => onTimerClick && onTimerClick()}
        />
        <NavButton
          variant="settings"
          style="nav-bar"
          onClick={onToggleMenu}
          ariaExpanded={isMenuOpen}
          ariaControls="settings-menu"
        />
      </div>
    </nav>
  );
};
