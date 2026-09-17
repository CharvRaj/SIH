import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SliderTrack({
  children,
  title,
  subtitle,
  badge,
  rightAction,
  className = '',
  itemClassName = '',
  scrollAmount = 320,
}) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    }
  };

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [children]);

  const handleScroll = (direction) => {
    if (!containerRef.current) return;
    const offset = direction === 'left' ? -scrollAmount : scrollAmount;
    containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header bar with title and slider navigation */}
      {(title || rightAction) && (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {badge && (
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-0.5">
                {badge}
              </span>
            )}
            {title && (
              <h2 className="text-base sm:text-lg font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-gray-400 truncate">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {rightAction}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800/80 p-1 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className="p-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-none hover:shadow-sm"
                title="Slide Previous"
                aria-label="Previous items"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="p-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-none hover:shadow-sm"
                title="Slide Next"
                aria-label="Next items"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sliding Track */}
      <div className="relative group">
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pt-1 no-scrollbar select-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {children}
        </div>

        {/* Left subtle shadow hint if scrollable */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-[var(--color-bg-secondary)] to-transparent opacity-80" />
        )}

        {/* Right subtle shadow hint if scrollable */}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-[var(--color-bg-secondary)] to-transparent opacity-80" />
        )}
      </div>

      {/* Progress Bar Track */}
      <div className="h-1 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-200 rounded-full"
          style={{ width: `${Math.max(15, scrollProgress)}%` }}
        />
      </div>
    </div>
  );
}
