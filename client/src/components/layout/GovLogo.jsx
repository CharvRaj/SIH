import { Link } from 'react-router-dom';

export default function GovLogo({ to = '/', compact = false, className = '' }) {
  return (
    <Link to={to} className={`flex items-center gap-3 no-underline group select-none ${className}`}>
      {/* State Emblem of India (Ashoka Lion Capital) Vector */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 120"
          className={compact ? "w-8 h-10" : "w-10 h-12"}
          fill="currentColor"
          style={{ color: 'var(--color-primary, #1e3a5f)' }}
          aria-label="State Emblem of India"
        >
          {/* Ashoka Lion Capital Graphic */}
          <g transform="translate(10, 5)">
            {/* Upper Lions */}
            <path
              d="M 40 5 C 32 5 28 12 28 18 C 28 24 33 28 35 32 C 32 32 26 31 23 34 C 19 37 19 44 23 48 C 26 51 32 50 35 52 C 34 54 32 57 32 60 L 48 60 C 48 57 46 54 45 52 C 48 50 54 51 57 48 C 61 44 61 37 57 34 C 54 31 48 32 45 32 C 47 28 52 24 52 18 C 52 12 48 5 40 5 Z"
              fill="currentColor"
            />
            {/* Center Ashoka Chakra Base */}
            <circle cx="40" cy="72" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="40" cy="72" r="2.5" fill="currentColor" />
            {/* Chakra Spokes */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="40"
                y1="72"
                x2={40 + 9 * Math.cos((deg * Math.PI) / 180)}
                y2={72 + 9 * Math.sin((deg * Math.PI) / 180)}
                stroke="currentColor"
                strokeWidth="1.2"
              />
            ))}
            {/* Base Pedestal */}
            <path d="M 16 85 L 64 85 L 60 90 L 20 90 Z" fill="currentColor" />
            <path d="M 10 92 L 70 92 L 67 96 L 13 96 Z" fill="currentColor" />
            {/* Satyameva Jayate Banner Text Representation */}
            <rect x="22" y="100" width="36" height="3" rx="1.5" fill="currentColor" opacity="0.8" />
          </g>
        </svg>
      </div>

      {/* Official Government Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-blue-900 dark:text-blue-200">
            भारत सरकार &bull; Government of India
          </span>
        </div>
        <span className="text-xs sm:text-sm font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
          Ministry of Statistics & Programme Implementation
        </span>
        <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-blue-700 dark:text-blue-300">
          सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय
        </span>
      </div>
    </Link>
  );
}
