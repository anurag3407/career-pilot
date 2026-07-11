import { motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StepWizard({ steps = [], currentStep = 0, onStepChange }) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="flex flex-col gap-8">
      {/* Step Indicator */}
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex items-start flex-1">
              {/* Step Node + Label */}
              <div className="flex flex-col items-center gap-2 min-w-0">
                <motion.button
                  onClick={() => onStepChange?.(index)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-2 cursor-pointer',
                    isCompleted && 'bg-green-500 border-green-500 text-white',
                    isCurrent && 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30',
                    !isCompleted && !isCurrent && 'bg-card border-border text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </motion.span>
                  ) : step.icon ? (
                    <step.icon className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.button>

                <div className="text-center px-1 max-w-[80px]">
                  <p className={cn(
                    'text-xs font-semibold leading-tight',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line — aligned to circle center (mt-5 = 20px = half of 40px circle) */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mt-5 mx-2 bg-border overflow-hidden rounded-full">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
          <button type="button"
            onClick={() => onStepChange?.(currentStep - 1)}
            disabled={isFirst}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black tracking-wide transition-all duration-300',
              isFirst
                ? 'opacity-40 cursor-not-allowed bg-card border-2 border-border text-muted-foreground'
                : 'bg-card border-2 border-border text-foreground hover:bg-muted hover:border-primary/50 cursor-pointer'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button type="button"
            onClick={() => onStepChange?.(currentStep + 1)}
            disabled={isLast}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black tracking-wide transition-all duration-300',
              isLast
                ? 'opacity-40 cursor-not-allowed bg-primary text-primary-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 cursor-pointer'
            )}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
      </div>
    </div>
  );
}
