import { motion } from "framer-motion";

interface RouteMapProps {
  className?: string;
  showGradient?: boolean;
}

const RouteMap = ({ className = "", showGradient = true }: RouteMapProps) => {
  const path = "M 40 180 C 60 160, 80 120, 100 130 S 140 100, 160 80 S 200 60, 220 90 S 260 120, 280 100 S 320 60, 340 80 S 360 110, 350 140 S 320 170, 290 160 S 250 180, 220 170 S 180 140, 160 160 S 120 190, 100 180";

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-card ${className}`}>
      {/* Grid pattern background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <svg viewBox="0 0 400 240" className="w-full h-full relative z-10" preserveAspectRatio="xMidYMid meet">
        <defs>
          {showGradient && (
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(18, 98%, 50%)" />
              <stop offset="50%" stopColor="hsl(5, 85%, 60%)" />
              <stop offset="100%" stopColor="hsl(35, 95%, 55%)" />
            </linearGradient>
          )}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Route glow */}
        <motion.path
          d={path}
          fill="none"
          stroke={showGradient ? "url(#routeGradient)" : "hsl(18, 98%, 50%)"}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Route line */}
        <motion.path
          d={path}
          fill="none"
          stroke={showGradient ? "url(#routeGradient)" : "hsl(18, 98%, 50%)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Start marker */}
        <motion.circle
          cx="40" cy="180" r="6"
          className="fill-success"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
        <motion.circle
          cx="40" cy="180" r="3"
          className="fill-success-foreground"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        />

        {/* End marker */}
        <motion.circle
          cx="100" cy="180" r="6"
          className="fill-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2 }}
        />
        <motion.circle
          cx="100" cy="180" r="3"
          className="fill-primary-foreground"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.1 }}
        />

        {/* Km markers */}
        {[
          { x: 100, y: 125, km: "1" },
          { x: 180, y: 75, km: "2" },
          { x: 260, y: 95, km: "3" },
          { x: 340, y: 75, km: "4" },
          { x: 290, y: 155, km: "5" },
        ].map((marker, i) => (
          <motion.g
            key={marker.km}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.3 }}
          >
            <circle cx={marker.x} cy={marker.y - 18} r="10" className="fill-secondary" />
            <text
              x={marker.x}
              y={marker.y - 14}
              textAnchor="middle"
              className="fill-foreground text-[9px] font-display font-bold"
            >
              {marker.km}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

export default RouteMap;
