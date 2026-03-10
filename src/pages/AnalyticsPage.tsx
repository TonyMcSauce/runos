import { motion } from "framer-motion";
import { ArrowLeft, TrendingDown, TrendingUp, Award, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MetricCard from "@/components/MetricCard";
import RouteMap from "@/components/RouteMap";
import { Button } from "@/components/ui/button";

const splits = [
  { km: 1, pace: "5:12", elevation: "+4m" },
  { km: 2, pace: "5:05", elevation: "-2m" },
  { km: 3, pace: "4:58", elevation: "+1m" },
  { km: 4, pace: "5:01", elevation: "-3m" },
  { km: 5, pace: "4:47", elevation: "+2m" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const AnalyticsPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="pb-8"
    >
      {/* Hero header with gradient */}
      <motion.div variants={item} className="gradient-strava px-4 pt-10 pb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary-foreground/10 rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-primary-foreground/5 rounded-full" />
        
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-foreground/80 active:text-primary-foreground transition-colors mb-4 relative z-10"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-sm font-body">Back</span>
        </button>

        <div className="text-center relative z-10">
          <p className="text-xs text-primary-foreground/70 font-body uppercase tracking-wider">Today's Run</p>
          <h1 className="metric-text text-5xl text-primary-foreground mt-2">5.20</h1>
          <p className="text-lg text-primary-foreground/80 font-body mt-1">kilometers</p>
        </div>
      </motion.div>

      <div className="px-4 space-y-5 -mt-2">
        {/* Personal Best Banner */}
        <motion.div
          variants={item}
          className="bg-accent border border-primary/20 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full gradient-strava flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-display font-semibold text-foreground">Personal Best: 5K</p>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              26:14 — 12 seconds faster than your previous record
            </p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={item} className="grid grid-cols-2 gap-3">
          <MetricCard label="Duration" value="26:14" />
          <MetricCard label="Avg Pace" value="5:03" unit="/km" />
          <MetricCard label="Calories" value="412" unit="kcal" />
          <MetricCard label="Elevation" value="+12" unit="m" />
        </motion.div>

        {/* Route Map */}
        <motion.div variants={item} className="space-y-3">
          <h2 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Route
          </h2>
          <RouteMap className="h-48" showGradient />
        </motion.div>

        {/* Pace Graph */}
        <motion.div variants={item} className="space-y-3">
          <h2 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Pace Over Distance
          </h2>
          <div className="bg-card rounded-2xl p-4">
            <div className="flex items-end justify-between h-28 gap-2">
              {splits.map((split) => {
                const paceSeconds = parseInt(split.pace.split(":")[0]) * 60 + parseInt(split.pace.split(":")[1]);
                const min = 280;
                const max = 320;
                const height = ((max - (paceSeconds - min)) / (max - min)) * 100;
                const isBest = split.pace === "4:47";
                return (
                  <div key={split.km} className="flex-1 flex flex-col items-center gap-1">
                    <span className={`text-[10px] font-body ${isBest ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                      {split.pace}
                    </span>
                    <motion.div
                      className={`w-full rounded-t-md ${isBest ? "gradient-strava" : "bg-primary/60"}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 20)}%` }}
                      transition={{ duration: 0.6, delay: split.km * 0.1 }}
                    />
                    <span className="text-[10px] text-muted-foreground font-body">{split.km}km</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Splits */}
        <motion.div variants={item} className="space-y-3">
          <h2 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Split Times
          </h2>
          <div className="bg-card rounded-2xl divide-y divide-border">
            {splits.map((split, i) => {
              const prev = i > 0 ? splits[i - 1] : null;
              const prevSec = prev
                ? parseInt(prev.pace.split(":")[0]) * 60 + parseInt(prev.pace.split(":")[1])
                : null;
              const curSec = parseInt(split.pace.split(":")[0]) * 60 + parseInt(split.pace.split(":")[1]);
              const faster = prevSec !== null && curSec < prevSec;
              const slower = prevSec !== null && curSec > prevSec;

              return (
                <div key={split.km} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-body w-10">km {split.km}</span>
                    <span className="metric-text text-sm text-card-foreground">{split.pace}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-body">{split.elevation}</span>
                    {faster && <TrendingDown className="w-3.5 h-3.5 text-success" strokeWidth={1.5} />}
                    {slower && <TrendingUp className="w-3.5 h-3.5 text-destructive" strokeWidth={1.5} />}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Coach Tip */}
        <motion.div variants={item} className="bg-card rounded-2xl p-4 space-y-2 border border-primary/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full gradient-strava flex items-center justify-center">
              <span className="text-[10px] font-display font-bold text-primary-foreground">AI</span>
            </div>
            <h2 className="font-display text-sm font-semibold text-foreground">Coach Insight</h2>
          </div>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Great negative split today — your final kilometer was your fastest at 4:47/km. 
            This shows strong pacing discipline. Consider starting your next run 5-10 seconds 
            slower per km to build an even larger finishing kick.
          </p>
        </motion.div>

        {/* Share Button */}
        <motion.div variants={item}>
          <Button variant="action" size="lg" className="w-full gradient-strava glow-primary">
            <Share2 className="w-4 h-4" strokeWidth={2} />
            Share Performance
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
