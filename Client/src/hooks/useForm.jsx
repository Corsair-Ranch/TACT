import { useState } from "react";

// function to switch the current page for the client to the next step when some button is clicked
export function useForm(steps, data, saved) {
  const [currentStep, setCurrentStep] = useState(0);

  // function to change current step when submit button is clicked
  const changeStep = (i, e) => {
    if (e) e.preventDefault();

    if (i < 0 || i >= steps.length) return;

    setCurrentStep(i);
  };

  return {
    currentStep,
    currentComponent: steps[currentStep],
    changeStep,
    isFarstStep: currentStep === 0 ? true : false,
  };
}
