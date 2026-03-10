import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, Eye, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MetricCard from "@/components/MetricCard";
import RouteMap from "@/components/RouteMap";

type RunState = "idle" | "running" | "paused";

const RunPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<RunState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (state !== "running") return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
      setDistance((d) => d + 0.003 + Math.random() * 0.002);
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const formatTime = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
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

  const handleStop = () => {
    setState("idle");
    setSeconds(0);
    setDistance(0);
    navigate("/analytics/1");
  };

  return (
    <div className="px-4 pt-12 min-h-screen flex flex-col">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          {state === "idle" ? "Ready to Run" : state === "paused" ? "Paused" : "Running"}
        </h1>
        <p className="text-xs text-muted-foreground font-body mt-1 uppercase tracking-wider">
          {state === "idle" ? "Tap start when you're ready" : "Stay focused, stay strong"}
        </p>
      </motion.div>

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
              onClick={() => setState("running")}
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
