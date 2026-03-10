import { motion } from "framer-motion";
import { User, Settings, ChevronRight, Activity, Target, Zap } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const ProfilePage = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-4 pt-14 space-y-6"
    >
      {/* Avatar & Info */}
      <motion.div variants={item} className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-7 h-7 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Alex Runner</h1>
          <p className="text-sm text-muted-foreground font-body">Advanced • 5 years</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="bg-card rounded-2xl p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="metric-text text-xl text-card-foreground">847</span>
            <p className="text-xs text-muted-foreground font-body mt-1">Total km</p>
          </div>
          <div>
            <span className="metric-text text-xl text-card-foreground">142</span>
            <p className="text-xs text-muted-foreground font-body mt-1">Runs</p>
          </div>
          <div>
            <span className="metric-text text-xl text-card-foreground">4:48</span>
            <p className="text-xs text-muted-foreground font-body mt-1">Best Pace</p>
          </div>
        </div>
      </motion.div>

      {/* Personal Records */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Personal Records
        </h2>
        <div className="bg-card rounded-2xl divide-y divide-border">
          <RecordRow icon={<Zap className="w-4 h-4" strokeWidth={1.5} />} label="Fastest km" value="4:12" />
          <RecordRow icon={<Activity className="w-4 h-4" strokeWidth={1.5} />} label="Longest run" value="21.3 km" />
          <RecordRow icon={<Target className="w-4 h-4" strokeWidth={1.5} />} label="Best avg pace" value="4:48 /km" />
        </div>
      </motion.div>

      {/* Goals */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Current Goals
        </h2>
        <div className="bg-card rounded-2xl p-4 space-y-4">
          <GoalRow label="Weekly Distance" current={24.8} target={30} unit="km" />
          <GoalRow label="Monthly Runs" current={12} target={20} unit="runs" />
        </div>
      </motion.div>

      {/* Settings links */}
      <motion.div variants={item} className="space-y-3 pb-8">
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Settings
        </h2>
        <div className="bg-card rounded-2xl divide-y divide-border">
          {["Units & Preferences", "Voice Feedback", "Export Data", "Theme"].map((s) => (
            <button
              key={s}
              className="w-full flex items-center justify-between px-4 py-3.5 active:bg-accent/50 transition-colors"
            >
              <span className="text-sm text-card-foreground font-body">{s}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const RecordRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between px-4 py-3.5">
    <div className="flex items-center gap-3">
      <span className="text-primary">{icon}</span>
      <span className="text-sm text-card-foreground font-body">{label}</span>
    </div>
    <span className="metric-text text-sm text-card-foreground">{value}</span>
  </div>
);

const GoalRow = ({ label, current, target, unit }: { label: string; current: number; target: number; unit: string }) => {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-body">{label}</span>
        <span className="text-xs text-muted-foreground font-body">
          {current} / {target} {unit}
        </span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
