import { motion } from "framer-motion";
import { MapPin, Clock, Flame, TrendingUp, ChevronRight } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { useNavigate } from "react-router-dom";

const recentRuns = [
  { id: 1, date: "Today", distance: "5.2", duration: "26:14", pace: "5:03", calories: "412" },
  { id: 2, date: "Yesterday", distance: "8.1", duration: "42:35", pace: "5:15", calories: "638" },
  { id: 3, date: "Mar 8", distance: "3.0", duration: "14:22", pace: "4:47", calories: "241" },
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
      className="px-4 pt-14 space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <p className="text-muted-foreground text-sm font-body">Good evening</p>
        <h1 className="font-display text-3xl font-bold text-foreground mt-1">RunOS</h1>
      </motion.div>

      {/* Weekly Summary */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          This Week
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Distance"
            value="24.8"
            unit="km"
            icon={<MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />}
          />
          <MetricCard
            label="Duration"
            value="2:04"
            unit="hrs"
            icon={<Clock className="w-3.5 h-3.5" strokeWidth={1.5} />}
          />
          <MetricCard
            label="Calories"
            value="1,891"
            unit="kcal"
            icon={<Flame className="w-3.5 h-3.5" strokeWidth={1.5} />}
          />
          <MetricCard
            label="Avg Pace"
            value="5:05"
            unit="/km"
            icon={<TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />}
          />
        </div>
      </motion.div>

      {/* Recent Runs */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">
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
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-body">{run.date}</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="metric-text text-xl text-card-foreground">{run.distance}</span>
                  <span className="text-sm text-muted-foreground font-body">km</span>
                </div>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-muted-foreground font-body">{run.duration}</span>
                  <span className="text-xs text-muted-foreground font-body">{run.pace} /km</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Health snapshot */}
      <motion.div variants={item} className="space-y-3 pb-4">
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Health
        </h2>
        <div className="bg-card rounded-2xl p-4 space-y-4">
          <HealthRow label="VO2 Max" value="48.2" unit="ml/kg/min" progress={72} />
          <HealthRow label="Recovery" value="Good" progress={85} />
          <HealthRow label="Training Load" value="Moderate" progress={55} />
          <HealthRow label="Fitness Score" value="74" unit="/100" progress={74} />
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
}: {
  label: string;
  value: string;
  unit?: string;
  progress: number;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground font-body">{label}</span>
      <span className="font-display text-sm font-semibold text-card-foreground">
        {value}
        {unit && <span className="text-xs text-muted-foreground font-body ml-1">{unit}</span>}
      </span>
    </div>
    <div className="h-1 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      />
    </div>
  </div>
);

export default HomePage;
