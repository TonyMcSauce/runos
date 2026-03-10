import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FocusMode = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [distance] = useState(2.34);

  useEffect(() => {
    const i = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, []);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center"
    >
      <button
        onClick={() => navigate(-1)}
        className="absolute top-12 right-6 text-muted-foreground active:text-foreground transition-colors"
      >
        <X className="w-6 h-6" strokeWidth={1.5} />
      </button>

      <div className="text-center space-y-10">
        <div>
          <span className="metric-text text-7xl text-foreground tabular-nums">
            {m.toString().padStart(2, "0")}:{s.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="flex gap-12">
          <div className="text-center">
            <span className="metric-text text-3xl text-foreground">{distance.toFixed(2)}</span>
            <p className="text-xs text-muted-foreground font-body mt-1">km</p>
          </div>
          <div className="text-center">
            <span className="metric-text text-3xl text-foreground">5:03</span>
            <p className="text-xs text-muted-foreground font-body mt-1">/km</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FocusMode;
