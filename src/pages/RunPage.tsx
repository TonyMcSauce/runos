import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, Eye, MapPin, Clock, Ruler, ChevronUp, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MetricCard from "@/components/MetricCard";
import RouteMap from "@/components/RouteMap";

type RunState = "idle" | "running" | "paused";
type RunMode = "free" | "distance" | "time";

const DISTANCE_PRESETS = [1, 3, 5, 10, 15, 21.1, 42.2];
const TIME_PRESETS = [10, 15, 20, 30, 45, 60, 90];

const RunPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<RunState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0);
  const [runMode, setRunMode] = useState<RunMode>("free");
  const [targetDistance, setTargetDistance] = useState(5);
  const [targetTime, setTargetTime] = useState(30);

  useEffect(() => {
    if (state !== "running") return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
      setDistance((d) => {
        const newD = d + 0.003 + Math.random() * 0.002;
        return newD;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  // Auto-stop when target reached
  useEffect(() => {
    if (state !== "running") return;
    if (runMode === "distance" && distance >= targetDistance) {
      handleStop();
    }
    if (runMode === "time" && seconds >= targetTime * 60) {
      handleStop();
    }
  }, [state, distance, seconds, runMode, targetDistance, targetTime]);

  const formatTime = useCallback((s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }, []);

  const currentPace = seconds > 0 && distance > 0
    ? (() => {
        const paceMin = (seconds / 60) / distance;
        const pm = Math.floor(paceMin);
        const ps = Math.round((paceMin - pm) * 60);
        return `${pm}:${ps.toString().padStart(2, "0")}`;
      })()
    : "--:--";

  const progress = runMode === "distance"
    ? Math.min((distance / targetDistance) * 100, 100)
    : runMode === "time"
    ? Math.min((seconds / (targetTime * 60)) * 100, 100)
    : 0;

  const handleStop = () => {
    setState("idle");
    setSeconds(0);
    setDistance(0);
    navigate("/analytics/1");
  };

  const handleStart = () => {
    setSeconds(0);
    setDistance(0);
    setState("running");
  };

  return (
    <div className="px-4 pt-12 min-h-screen flex flex-col">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {state === "idle" ? "Ready to Run" : state === "paused" ? "Paused" : "Running"}
        </h1>
        <p className="text-xs text-muted-foreground font-body mt-1 uppercase tracking-wider">
          {state === "idle" ? "Choose your run type below" : "Stay focused, stay strong"}
        </p>
      </motion.div>

      {/* Run Mode Selector — only when idle */}
      <AnimatePresence>
        {state === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 space-y-4"
          >
            {/* Mode tabs */}
            <div className="flex bg-card rounded-2xl p-1 gap-1">
              {([
                { mode: "free" as RunMode, label: "Free Run", icon: Play },
                { mode: "distance" as RunMode, label: "Distance", icon: Ruler },
                { mode: "time" as RunMode, label: "Time", icon: Clock },
              ]).map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setRunMode(mode)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-display font-semibold transition-all duration-200 ${
                    runMode === mode
                      ? "gradient-strava text-primary-foreground shadow-md"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {label}
                </button>
              ))}
            </div>

            {/* Target selector */}
            {runMode === "distance" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-4 space-y-3"
              >
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Target Distance</p>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-10 h-10"
                    onClick={() => setTargetDistance(Math.max(0.5, targetDistance - 0.5))}
                  >
                    <ChevronDown className="w-4 h-4" strokeWidth={2} />
                  </Button>
                  <div className="text-center min-w-[100px]">
                    <span className="metric-text text-4xl text-foreground">{targetDistance}</span>
                    <span className="text-sm text-muted-foreground font-body ml-1">km</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-10 h-10"
                    onClick={() => setTargetDistance(targetDistance + 0.5)}
                  >
                    <ChevronUp className="w-4 h-4" strokeWidth={2} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {DISTANCE_PRESETS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setTargetDistance(d)}
                      className={`px-3 py-1.5 rounded-full text-xs font-display font-semibold transition-all ${
                        targetDistance === d
                          ? "gradient-strava text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {d === 21.1 ? "Half" : d === 42.2 ? "Full" : `${d}km`}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {runMode === "time" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-4 space-y-3"
              >
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Target Duration</p>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-10 h-10"
                    onClick={() => setTargetTime(Math.max(5, targetTime - 5))}
                  >
                    <ChevronDown className="w-4 h-4" strokeWidth={2} />
                  </Button>
                  <div className="text-center min-w-[100px]">
                    <span className="metric-text text-4xl text-foreground">{targetTime}</span>
                    <span className="text-sm text-muted-foreground font-body ml-1">min</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-10 h-10"
                    onClick={() => setTargetTime(targetTime + 5)}
                  >
                    <ChevronUp className="w-4 h-4" strokeWidth={2} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {TIME_PRESETS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTargetTime(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-display font-semibold transition-all ${
                        targetTime === t
                          ? "gradient-strava text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {t >= 60 ? `${t / 60}h` : `${t}min`}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {runMode === "free" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-4 text-center"
              >
                <p className="text-sm text-muted-foreground font-body">
                  Run freely without any target. Stop whenever you want.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map when running */}
      <AnimatePresence>
        {state !== "idle" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <RouteMap className="h-36" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar for distance/time goals */}
      <AnimatePresence>
        {state !== "idle" && runMode !== "free" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 space-y-1"
          >
            <div className="flex justify-between text-[10px] text-muted-foreground font-body uppercase tracking-wider">
              <span>
                {runMode === "distance"
                  ? `${distance.toFixed(2)} / ${targetDistance} km`
                  : `${formatTime(seconds)} / ${formatTime(targetTime * 60)}`}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full gradient-strava"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Metric */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-1"
        >
          <span className="text-6xl metric-text text-foreground tabular-nums">
            {formatTime(seconds)}
          </span>
          <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Duration</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mt-8 w-full">
          <MetricCard label="Distance" value={distance.toFixed(2)} unit="km" />
          <MetricCard label="Pace" value={currentPace} unit="/km" />
          <MetricCard
            label="Calories"
            value={Math.round(distance * 65).toString()}
            unit="kcal"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 pb-8 mt-8">
        {state === "idle" ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full gradient-strava animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full gradient-strava animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
            <Button
              variant="action"
              className="w-20 h-20 rounded-full text-lg gradient-strava glow-primary relative z-10"
              onClick={handleStart}
            >
              <Play className="w-8 h-8 ml-1" strokeWidth={1.5} />
            </Button>
          </motion.div>
        ) : (
          <>
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full border-2"
              onClick={() => setState(state === "running" ? "paused" : "running")}
            >
              {state === "running" ? (
                <Pause className="w-5 h-5" strokeWidth={2} />
              ) : (
                <Play className="w-5 h-5 ml-0.5" strokeWidth={2} />
              )}
            </Button>
            <Button
              className="w-16 h-16 rounded-full bg-destructive text-destructive-foreground shadow-lg active:scale-95 transition-transform"
              onClick={handleStop}
            >
              <Square className="w-6 h-6" strokeWidth={2} fill="currentColor" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full border-2"
              onClick={() => navigate("/focus")}
            >
              <Eye className="w-5 h-5" strokeWidth={2} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default RunPage;
