import React, { useState, useEffect, useRef } from 'react';
import ProductTourMobile from './productTourMobile';
import { on } from 'events';

interface TourStepProps {
  target: string;
  title: string;
  content: string;
  direction?: string;
}

interface ProductTourProps {
  steps: TourStepProps[];
  isOpen: boolean;
  onClose: () => void;
  onStepChange: (target: string) => void; // Callback to notify step change
}

const ProductTour: React.FC<ProductTourProps> = ({ steps, isOpen, onClose, onStepChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDirection, setCurrentDirection] = useState('bottom');
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [modalPosition, setModalPosition] = useState<{ top: string; left: string; transform: string } | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);



  

  let arrow_classes = '';
  useEffect(() => {
    if (isOpen && steps.length > 0) {
      const targetElement = document.querySelector(steps[currentStep].target) as HTMLElement;
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setHighlightRect(rect);

        // Set modal position based on target element's position and direction
        const direction = steps[currentStep].direction || 'bottom';
        const position = calculateModalPosition(rect, direction as 'bottom' | 'top' | 'left' | 'right');
        setModalPosition(position);

        onStepChange(steps[currentStep].target); // Notify parent of step change

        if (!isScrolling) {
          window.scrollTo({
            top: rect.top + window.scrollY - (window.innerHeight / 2) + (rect.height / 2),
            behavior: 'smooth'
          });
          setIsScrolling(true);
        }
      }
    }
  }, [currentStep, isOpen, steps, isScrolling, onStepChange]);

  const calculateModalPosition = (rect: DOMRect, direction: 'top' | 'bottom' | 'left' | 'right') => {
    let top = `${rect.top + window.scrollY}px`;
    let left = `${rect.left + window.scrollX}px`;
    let transform = '';

    switch (direction) {
      case 'top':
        top = `${rect.top + window.scrollY - 70}px`; // Adjust modal above the target
        left = `${rect.left + window.scrollX + (rect.width / 2) - 150}px`; // Center modal horizontally above target
        transform = 'translateY(-100%)';
        arrow_classes = "0";
        setCurrentDirection('top');
        // Move modal above target
        break;
      case 'bottom':
        top = `${rect.bottom + window.scrollY + 10}px`; // Adjust modal below the target
        left = `${rect.left + window.scrollX + (rect.width / 2) - 150}px`; // Center modal horizontally below target
        transform = 'translateY(0)';
        setCurrentDirection('bottom');
        arrow_classes = " bottom-[70px] bg-red-200 left-[-110px] rotate-180 " // Keep modal below target
        break;
      case 'left':
        top = `${rect.top + window.scrollY + (rect.height / 2) - 75}px`; // Center modal vertically relative to target
        left = `${rect.left + window.scrollX - 310}px`; // Adjust modal to the left of the target
        transform = 'translateX(-100%)'; // Move modal left of target
        setCurrentDirection('left');
        break;
      case 'right':
        top = `${rect.top + window.scrollY + (rect.height / 2) - 15}px`; // Center modal vertically relative to target
        left = `${rect.right + window.scrollX + 50}px`; // Adjust modal to the right of the target
        transform = 'translateX(0)'; // Keep modal right of target
        setCurrentDirection('right');
        break;
    }
    return { top, left, transform };
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
    setIsScrolling(false);
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
    setIsScrolling(false);
  };



 const  handleTourClose = () => {
    onClose();
    setCurrentStep(0);

 }

  if (!isOpen) return null;



  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50" />
        {/* Exclude blur on the targeted element */}
    
      </div>

      {/* Modal */}

  
      <div
        className="fixed z-50 pointer-events-auto bg-white p-4 shadow-lg rounded-lg"
        style={{
            top: modalPosition?.top,
            left: modalPosition?.left,
            transform: modalPosition?.transform,
            width: '300px', // Modal width
            height: '150px', // Modal height
            position: 'absolute'
        }}
      >
        <div className={`absolute ${currentDirection === 'bottom' ? "bottom-[70px] left-[-110px] rotate-180" : currentDirection === 'top' ? "bottom-[-80px]  left-[-100px] -scale-x-100 -rotate-12 " : currentDirection === "right" ? "bottom-[10px] left-[-110px] transform rotate-[180deg]" : ""} `} >

        <img src="curved-arrow.svg" alt="Profile" className="w-24 h-24 rounded-full mr-4" />

        </div>
        <div className="relative">
        <div className='w-full flex justify-end items-end mb-2'>
        <button
            onClick={handleTourClose}
            className=" text-gray-600 hover:text-gray-800 transition"
          >
            {/* Cross Icon SVG */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPreviousStep}
              className="text-gray-600 hover:text-gray-800 transition"
              disabled={currentStep === 0}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold">{steps[currentStep].title}</h2>
            <button
              onClick={goToNextStep}
              className="text-gray-600 hover:text-gray-800 transition"
              disabled={currentStep === steps.length - 1}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p>{steps[currentStep].content}</p>
          
        </div>
      </div>
    </>
  );
};

export default ProductTour;
