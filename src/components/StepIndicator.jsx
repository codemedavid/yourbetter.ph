import { Check } from 'lucide-react';

export default function StepIndicator({ steps, currentStep }) {
    return (
        <div className="step-indicator">
            {steps.map((label, i) => {
                const isActive = i === currentStep;
                const isCompleted = i < currentStep;
                return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        {i > 0 && (
                            <div className={`step-connector ${isCompleted || isActive ? 'active' : ''}`} />
                        )}
                        <div className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                            <div className="step-circle">
                                {isCompleted ? <Check size={16} /> : i + 1}
                            </div>
                            <span className="step-label">{label}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
