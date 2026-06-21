import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function WizardStepper({ steps, currentStep }) {
  return (
    <div className="mb-8 flex items-center justify-between relative">
      <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -z-10 transform -translate-y-1/2" />
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        const StepIcon = step.icon
        return (
          <div key={step.id} className="flex flex-col items-center">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
              isActive ? 'bg-primary border-primary text-primary-foreground' :
              isCompleted ? 'bg-primary/20 border-primary text-primary' :
                            'bg-background border-border text-muted-foreground'
            )}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
            </div>
            <span className={cn(
              'text-xs mt-2 hidden sm:block',
              isActive ? 'text-primary font-medium' : 'text-muted-foreground'
            )}>
              {step.title}
            </span>
          </div>
        )
      })}
    </div>
  )
}
