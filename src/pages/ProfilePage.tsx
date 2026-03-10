import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, ChevronRight, Activity, Target, Zap, MapPin, Trophy, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

interface ProfileData {
  name: string;
  age: string;
  weight: string;
  height: string;
  experience: string;
  weeklyGoal: number;
  monthlyRunsGoal: number;
  fiveKGoal: number;
}

const DEFAULT_PROFILE: ProfileData = {
  name: "Alex Runner",
  age: "28",
  weight: "72",
  height: "178",
  experience: "Advanced",
  weeklyGoal: 30,
  monthlyRunsGoal: 20,
  fiveKGoal: 22,
};

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced", "Elite"];

const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem("runos-profile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileData>(profile);

  useEffect(() => {
    localStorage.setItem("runos-profile", JSON.stringify(profile));
  }, [profile]);

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-4 pt-12 space-y-5"
    >
      {/* Avatar & Info */}
      <motion.div variants={item} className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full gradient-strava flex items-center justify-center shadow-lg">
          <User className="w-7 h-7 text-primary-foreground" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          {editing ? (
            <Input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="font-display text-xl font-bold h-8 bg-secondary border-none"
            />
          ) : (
            <h1 className="font-display text-xl font-bold text-foreground">{profile.name}</h1>
          )}
          <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">
            {profile.experience} • {profile.age} yrs
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="rounded-full"
        >
          {editing ? (
            <Check className="w-5 h-5 text-success" strokeWidth={2} />
          ) : (
            <Edit2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          )}
        </Button>
        {editing && (
          <Button variant="ghost" size="icon" onClick={handleCancel} className="rounded-full -ml-2">
            <X className="w-5 h-5 text-destructive" strokeWidth={2} />
          </Button>
        )}
      </motion.div>

      {/* Editable Details */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card rounded-2xl p-4 space-y-3"
        >
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Age</label>
              <Input
                type="number"
                value={draft.age}
                onChange={(e) => setDraft({ ...draft, age: e.target.value })}
                className="h-9 bg-secondary border-none mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Weight (kg)</label>
              <Input
                type="number"
                value={draft.weight}
                onChange={(e) => setDraft({ ...draft, weight: e.target.value })}
                className="h-9 bg-secondary border-none mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Height (cm)</label>
              <Input
                type="number"
                value={draft.height}
                onChange={(e) => setDraft({ ...draft, height: e.target.value })}
                className="h-9 bg-secondary border-none mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Experience</label>
            <div className="flex gap-2 mt-1">
              {EXPERIENCE_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDraft({ ...draft, experience: lvl })}
                  className={`flex-1 py-2 rounded-xl text-xs font-display font-semibold transition-all ${
                    draft.experience === lvl
                      ? "gradient-strava text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-3 gap-2">
        <StatBox icon={<MapPin className="w-4 h-4 text-primary" strokeWidth={1.5} />} value="847" label="km" />
        <StatBox icon={<Activity className="w-4 h-4 text-primary" strokeWidth={1.5} />} value="142" label="runs" />
        <StatBox icon={<Zap className="w-4 h-4 text-primary" strokeWidth={1.5} />} value="4:48" label="best pace" />
      </motion.div>

      {/* Personal Records */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Personal Records
        </h2>
        <div className="bg-card rounded-2xl divide-y divide-border">
          <RecordRow icon={<Zap className="w-4 h-4" strokeWidth={1.5} />} label="Fastest km" value="4:12" />
          <RecordRow icon={<MapPin className="w-4 h-4" strokeWidth={1.5} />} label="Longest run" value="21.3 km" />
          <RecordRow icon={<Target className="w-4 h-4" strokeWidth={1.5} />} label="Best avg pace" value="4:48 /km" />
          <RecordRow icon={<Trophy className="w-4 h-4" strokeWidth={1.5} />} label="Best 5K" value="22:45" />
        </div>
      </motion.div>

      {/* Goals */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Current Goals
        </h2>
        <div className="bg-card rounded-2xl p-4 space-y-4">
          <GoalRow label="Weekly Distance" current={24.8} target={profile.weeklyGoal} unit="km" editing={editing} onTargetChange={(v) => setDraft({ ...draft, weeklyGoal: v })} draftTarget={draft.weeklyGoal} />
          <GoalRow label="Monthly Runs" current={12} target={profile.monthlyRunsGoal} unit="runs" editing={editing} onTargetChange={(v) => setDraft({ ...draft, monthlyRunsGoal: v })} draftTarget={draft.monthlyRunsGoal} />
          <GoalRow label="5K Target" current={22.45} target={profile.fiveKGoal} unit="min" editing={editing} onTargetChange={(v) => setDraft({ ...draft, fiveKGoal: v })} draftTarget={draft.fiveKGoal} />
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div variants={item} className="space-y-3 pb-8">
        <h2 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Settings
        </h2>
        <div className="bg-card rounded-2xl divide-y divide-border">
          {["Units & Preferences", "Voice Feedback", "Export Data", "Theme & Accent Color", "Account"].map((s) => (
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

const StatBox = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="bg-card rounded-2xl p-3 text-center">
    <div className="flex justify-center mb-1">{icon}</div>
    <span className="metric-text text-lg text-card-foreground block">{value}</span>
    <span className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{label}</span>
  </div>
);

const RecordRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between px-4 py-3.5">
    <div className="flex items-center gap-3">
      <span className="text-primary">{icon}</span>
      <span className="text-sm text-card-foreground font-body">{label}</span>
    </div>
    <span className="metric-text text-sm text-card-foreground">{value}</span>
  </div>
);

const GoalRow = ({ label, current, target, unit, editing, onTargetChange, draftTarget }: {
  label: string; current: number; target: number; unit: string;
  editing: boolean; onTargetChange: (v: number) => void; draftTarget: number;
}) => {
  const displayTarget = editing ? draftTarget : target;
  const pct = Math.min((current / displayTarget) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-body">{label}</span>
        {editing ? (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-muted-foreground font-body">{current} /</span>
            <Input
              type="number"
              value={draftTarget}
              onChange={(e) => onTargetChange(Number(e.target.value))}
              className="w-16 h-6 text-[11px] bg-secondary border-none px-2"
            />
            <span className="text-[11px] text-muted-foreground font-body">{unit}</span>
          </div>
        ) : (
          <span className="text-[11px] text-muted-foreground font-body">
            {current} / {displayTarget} {unit}
          </span>
        )}
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full gradient-strava"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
