import React from 'react';
import { useOnboarding } from '@natural/context/OnboardingContext';

interface OnboardingStepProps {
  title: string;
  description: React.ReactNode;
  image: string;
}

interface OnboardingProps {
  onClose: () => void;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  description,
  image,
}: OnboardingStepProps) => (
  <div className="text-center">
    <img src={image} alt={title} className="mx-auto mb-4" />
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <div className="text-gray-600 dark:text-gray-300">{description}</div>
  </div>
);

const steps: OnboardingStepProps[] = [
  {
    title: 'Welcome to Natural Reminders!',
    description: 'Create reminders using natural language',
    image: '/images/welcome.png'
  },
  {
    title: 'Smart Suggestions',
    description: 'Get intelligent suggestions as you type',
    image: '/images/suggestions.png'
  },
  {
    title: 'Stay Organized',
    description: 'Categorize and manage your reminders easily',
    image: '/images/organize.png'
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({
  onClose,
}: OnboardingProps) => {
  const { isFirstTime, completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = React.useState(0);

  if (!isFirstTime) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev: number) => prev + 1);
    } else {
      completeOnboarding();
      onClose();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    onClose();
  };

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <OnboardingStep 
          title={currentStepData.title}
          description={currentStepData.description}
          image={currentStepData.image}
        />
        
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
