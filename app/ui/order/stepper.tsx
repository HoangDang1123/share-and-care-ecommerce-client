'use client'

import * as React from 'react';
import Stepper from '@mui/material/Stepper';
import { Step, StepLabel } from '@mui/material';

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

export default function OrderStepper() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());

    const isStepOptional = (step: number) => {
        return step === 1;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <div className="w-full max-w-lg p-6 mx-auto bg-white rounded-lg shadow-lg border border-gray-300">
            <Stepper>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: { optional?: React.ReactNode } = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <span className="text-xs text-gray-600">Optional</span>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps} className="font-semibold text-lg mb-2 text-gray-900">{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <p className="mt-4 mb-2 text-center text-lg font-medium text-gray-900">
                        All steps completed - you&apos;re finished
                    </p>
                    <div className="flex justify-center pt-4">
                        <button className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition duration-300 transform hover:scale-105" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <p className="mt-4 mb-2 text-center text-lg font-medium text-gray-900">Step {activeStep + 1}</p>
                    <div className="flex justify-between items-center pt-4">
                        <button
                            className="flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition duration-300 transform hover:scale-105"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                        >
                            Back
                        </button>
                        {isStepOptional(activeStep) && (
                            <button className="flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition duration-300 transform hover:scale-105" onClick={handleSkip}>
                                Skip
                            </button>
                        )}
                        <button className="flex items-center justify-center px-6 py-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition duration-300 transform hover:scale-105" onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
}
