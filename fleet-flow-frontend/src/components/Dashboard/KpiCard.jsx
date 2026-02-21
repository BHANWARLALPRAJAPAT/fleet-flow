import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({ title, value, icon: Icon, colorClass, trend, trendValue }) {
  const isPositive = trend === "up";
  
  return (
    <div className={`kpi-card kpi--${colorClass}`}>
      <div className="kpi-icon-wrapper">
        <Icon size={24} />
      </div>
      <div className="kpi-content">
        <p className="kpi-label">{title}</p>
        <div className="kpi-value-row">
          <span className="kpi-value">{value}</span>
          {trendValue && (
            <span className={`kpi-trend ${isPositive ? "kpi-trend--up" : "kpi-trend--down"}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trendValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
