import { motion } from "framer-motion";
import { MapPin, Clock, Flame, TrendingUp, ChevronRight, Zap } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import RouteMap from "@/components/RouteMap";
import { useNavigate } from "react-router-dom";

const recentRuns = [
  { id: 1, date: "Today", distance: "5.2", duration: "26:14", pace: "5:03", calories: "412", isPR: true },
  { id: 2, date: "Yesterday", distance: "8.1", duration: "42:35", pace: "5:15", calories: "638", isPR: false },
  { id: 3, date: "Mar 8", distance: "3.0", duration: "14:22", pace: "4:47", calories: "241", isPR: false },
  { id: 4, date: "Mar 6", distance: "10.0", duration: "52:10", pace: "5:13", calories: "790", isPR: false },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-4 pt-12 space-y-5"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-body uppercase tracking-wider">Good evening</p>
          <h1 className="font-display text-2xl font-bold gradient-text mt-0.5">RunOS</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full gradient-strava flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
          </div>
        </div>
      </motion.div>

      {/* Weekly Summary Banner */}
      <motion.div variants={item} className="gradient-strava rounded-2xl p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-primary-foreground/80 text-xs font-body uppercase tracking-wider">This Week</p>
        <div className="flex items-end gap-6 mt-2 relative z-10">
          <div>
            <span className="metric-text text-3xl text-primary-foreground">24.8</span>
            <span className="text-sm text-primary-foreground/70 font-body ml-1">km</span>
          </div>
          <div>
            <span className="metric-text text-lg text-primary-foreground">4</span>
            <span className="text-xs text-primary-foreground/70 font-body ml-1">runs</span>
          </div>
          <div>
            <span className="metric-text text-lg text-primary-foreground">2:04</span>
            <span className="text-xs text-primary-foreground/70 font-body ml-1">hrs</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Calories"
          value="1,891"
          unit="kcal"
          icon={<Flame className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />}
        />
        <MetricCard
          label="Avg Pace"
          value="5:05"
          unit="/km"
          icon={<TrendingUp className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />}
        />
      </motion.div>

      {/* Latest Run Map */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Latest Route
        </h2>
        <button onClick={() => navigate("/analytics/1")} className="w-full active:scale-[0.98] transition-transform">
          <RouteMap className="h-44" />
        </button>
      </motion.div>

      {/* Recent Runs */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Recent Runs
        </h2>
        <div className="space-y-2">
          {recentRuns.map((run) => (
            <motion.button
              key={run.id}
              variants={item}
              onClick={() => navigate(`/analytics/${run.id}`)}
              className="w-full bg-card rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform"
            >
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{run.date}</span>
                  {run.isPR && (
                    <span className="text-[9px] font-display font-semibold text-primary bg-accent px-1.5 py-0.5 rounded-full">
                      PR
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="metric-text text-xl text-card-foreground">{run.distance}</span>
                  <span className="text-xs text-muted-foreground font-body">km</span>
                </div>
                <div className="flex gap-4 mt-0.5">
                  <span className="text-[11px] text-muted-foreground font-body">
                    <Clock className="w-3 h-3 inline mr-1 -mt-0.5" strokeWidth={1.5} />
                    {run.duration}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-body">
                    <TrendingUp className="w-3 h-3 inline mr-1 -mt-0.5" strokeWidth={1.5} />
                    {run.pace} /km
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Health Dashboard */}
      <motion.div variants={item} className="space-y-3 pb-6">
        <h2 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Fitness
        </h2>
        <div className="bg-card rounded-2xl p-4 space-y-4">
          <HealthRow label="VO2 Max" value="48.2" unit="ml/kg/min" progress={72} color="primary" />
          <HealthRow label="Recovery" value="Good" progress={85} color="success" />
          <HealthRow label="Training Load" value="Moderate" progress={55} color="info" />
          <HealthRow label="Fitness Score" value="74" unit="/100" progress={74} color="primary" />
        </div>
      </motion.div>
    </motion.div>
  );
};

const HealthRow = ({
  label,
  value,
  unit,
  progress,
  color,
}: {
  label: string;
  value: string;
  unit?: string;
  progress: number;
  color: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-muted-foreground font-body">{label}</span>
      <span className="font-display text-sm font-semibold text-card-foreground">
        {value}
        {unit && <span className="text-[10px] text-muted-foreground font-body ml-1">{unit}</span>}
      </span>
    </div>
    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${
          color === "success" ? "bg-success" : color === "info" ? "bg-info" : "bg-primary"
        }`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      />
    </div>
  </div>
);

export default HomePage;
