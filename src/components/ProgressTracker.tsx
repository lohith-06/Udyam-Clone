import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const ProgressTracker = ({ currentStep, totalSteps, steps }: ProgressTrackerProps) => {
  return (
    <div className="bg-card border rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Registration Progress</h3>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={index} className="flex items-center space-x-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-smooth",
                  {
                    "bg-success text-success-foreground border-success": isCompleted,
                    "bg-primary text-primary-foreground border-primary": isCurrent,
                    "bg-muted text-muted-foreground border-border": isPending,
                  }
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-medium transition-smooth",
                    {
                      "text-success": isCompleted,
                      "text-foreground": isCurrent,
                      "text-muted-foreground": isPending,
                    }
                  )}
                >
                  {step}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};