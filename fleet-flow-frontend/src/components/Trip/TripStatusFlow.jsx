import { CheckCircle2, Circle, XCircle, ArrowRight } from "lucide-react";

export default function TripStatusFlow({ status }) {
  const steps = [
    { id: "DRAFT", label: "Draft" },
    { id: "DISPATCHED", label: "Dispatched" },
    { id: "COMPLETED", label: "Completed" },
  ];

  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
        <XCircle size={16} />
        Trip Cancelled
      </div>
    );
  }

  const activeIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {idx <= activeIndex ? (
              <CheckCircle2 size={14} className="text-emerald-500" />
            ) : (
              <Circle size={14} className="text-slate-300" />
            )}
            <span className={`text-[10px] font-bold uppercase tracking-widest ${idx === activeIndex ? 'text-slate-900' : 'text-slate-400'}`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && <ArrowRight size={12} className="text-slate-200" />}
        </div>
      ))}
    </div>
  );
}
