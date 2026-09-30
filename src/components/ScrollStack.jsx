'use client';

import { Children, useLayoutEffect, useRef } from 'react';
import './ScrollStack.css';

/* ScrollStack, reworked for smooth window scrolling.
   The original measured each card's position while also translating it (a feedback loop that made
   images jitter) and ran a second Lenis instance on top of native scroll. Here each card sits in a
   `position: sticky` slot the browser pins for free, and one rAF pass only scales the card inside a
   slot as the next one covers it. Transforms never affect sticky layout, so nothing fights. */

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  baseScale = 0.85,
  blurAmount = 0
}) => {
  const rootRef = useRef(null);
  const items = Children.toArray(children);
  const n = items.length;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const slots = [...root.querySelectorAll(':scope > .scroll-stack-inner > .scroll-stack-slot')];
    const cards = slots.map((s) => s.firstElementChild);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = false;
    const last = new Array(slots.length).fill(-1);

    const update = () => {
      raf = 0;
      for (let i = 0; i < slots.length - 1; i++) {
        const a = slots[i].getBoundingClientRect();
        const b = slots[i + 1].getBoundingClientRect();
        // 0 while the next card is a full card-height away, 1 once it has landed on top
        const t = Math.min(1, Math.max(0, 1 - (b.top - a.top - itemStackDistance) / (a.height || 1)));
        const k = Math.round((1 - t * (1 - (baseScale + i * itemScale))) * 1000) / 1000;
        if (k !== last[i] && cards[i]) {
          last[i] = k;
          cards[i].style.transform = `scale(${k})`;
          if (blurAmount) cards[i].style.filter = t > 0.01 ? `blur(${(t * blurAmount).toFixed(2)}px)` : '';
        }
      }
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(root);
    if (!reduce) {
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
    }
    update();
    return () => {
      io.disconnect();
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n, itemScale, itemStackDistance, baseScale, blurAmount]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={rootRef}>
      <div className="scroll-stack-inner">
        {items.map((child, i) => (
          <div
            key={child.key ?? i}
            className="scroll-stack-slot"
            style={{ top: `calc(${stackPosition} + ${i * itemStackDistance}px)`, marginBottom: i < n - 1 ? itemDistance : 0, zIndex: i + 1 }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollStack;
