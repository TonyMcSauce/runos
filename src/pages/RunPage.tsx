import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MetricCard from "@/components/MetricCard";

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
    navigate("/analytics/1");
  };

  return (
    <div className="px-4 pt-14 min-h-screen flex flex-col">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          {state === "idle" ? "Ready to Run" : state === "paused" ? "Paused" : "Running"}
        </h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          {state === "idle" ? "Tap start when you're ready" : "Stay focused, stay strong"}
        </p>
      </motion.div>

      {/* Main Metric */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center -mt-8"
        >
          <div className="text-center space-y-2">
            <span className="text-6xl metric-text text-foreground tabular-nums">
              {formatTime(seconds)}
            </span>
            <p className="text-sm text-muted-foreground font-body">Duration</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-10 w-full">
            <MetricCard label="Distance" value={distance.toFixed(2)} unit="km" />
            <MetricCard label="Pace" value={currentPace} unit="/km" />
            <MetricCard
              label="Calories"
              value={Math.round(distance * 65).toString()}
              unit="kcal"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 pb-8 mt-8">
        {state === "idle" ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
            <Button
              variant="action"
              size="xl"
              className="w-20 h-20 rounded-full text-lg"
              onClick={() => setState("running")}
            >
              <Play className="w-7 h-7 ml-1" strokeWidth={1.5} />
            </Button>
          </motion.div>
        ) : (
          <>
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full"
              onClick={() => setState(state === "running" ? "paused" : "running")}
            >
              {state === "running" ? (
                <Pause className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Play className="w-5 h-5 ml-0.5" strokeWidth={1.5} />
              )}
            </Button>
            <Button
              variant="action"
              className="w-14 h-14 rounded-full bg-destructive shadow-destructive/25"
              onClick={handleStop}
            >
              <Square className="w-5 h-5" strokeWidth={1.5} fill="currentColor" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full"
              onClick={() => navigate("/focus")}
            >
              <Eye className="w-5 h-5" strokeWidth={1.5} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default RunPage;
