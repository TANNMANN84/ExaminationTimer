import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTooltip } from '../../context/TooltipContext';

export const Tooltip: React.FC = () => {
  const { tooltipContent, isTooltipVisible, targetElement } = useTooltip();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });

  useEffect(() => {
    if (isTooltipVisible && targetElement && tooltipRef.current) {
      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const gap = 10;

      let top = targetRect.bottom + gap;
      let left = targetRect.left + targetRect.width / 2;

      // Vertical flip logic
      if (top + tooltipRect.height > viewport.height) {
        top = targetRect.top - tooltipRect.height - gap;
      }

      // Horizontal constraints
      // Ensure left edge doesn't go off-screen
      if (left - tooltipRect.width / 2 < 0) {
        left = tooltipRect.width / 2 + gap;
      }
      // Ensure right edge doesn't go off-screen
      else if (left + tooltipRect.width / 2 > viewport.width) {
        left = viewport.width - tooltipRect.width / 2 - gap;
      }
      
      setStyle({
        top: `${top}px`,
        left: `${left}px`,
        transform: `translateX(-50%)`,
        opacity: 1,
      });

    } else {
      setStyle({ opacity: 0 });
    }
  }, [isTooltipVisible, targetElement, tooltipContent]); // Rerun when content changes to account for size differences

  if (!isTooltipVisible) {
    return null;
  }

  return createPortal(
    <div
      id="global-tooltip"
      ref={tooltipRef}
      role="tooltip"
      className="fixed z-[9999] p-3 text-sm text-white dark:text-slate-900 bg-slate-800 dark:bg-slate-200 rounded-lg shadow-lg pointer-events-none transition-opacity duration-200 flex flex-col items-center justify-center text-center gap-2 max-w-xs"
      style={style}
    >
      {tooltipContent}
    </div>,
    document.body
  );
};