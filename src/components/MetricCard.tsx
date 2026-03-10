import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  className?: string;
  icon?: ReactNode;
}

const MetricCard = ({ label, value, unit, className, icon }: MetricCardProps) => (
  <div className={cn("bg-card rounded-2xl p-4 flex flex-col gap-1", className)}>
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="text-xs font-body font-medium uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="metric-text text-2xl text-card-foreground">{value}</span>
      {unit && <span className="text-sm text-muted-foreground font-body">{unit}</span>}
    </div>
  </div>
);

export default MetricCard;
