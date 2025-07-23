import React, { useRef, useEffect } from 'react';
import '../styles/Dock.css';
import { NavButton } from './index';

interface DockProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onTimerClick?: () => void;
}

export const Dock: React.FC<DockProps> = ({ isMenuOpen, onToggleMenu, onTimerClick }) => {
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMenuOpen && settingsButtonRef.current) {
      settingsButtonRef.current.blur();
    }
  }, [isMenuOpen]);

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
          ref={settingsButtonRef}
        />
      </div>
    </nav>
  );
};
