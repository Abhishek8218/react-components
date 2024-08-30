import React, { useState, useEffect, useRef } from 'react';

interface TourStepProps {
  target: string;
  title: string;
  content: string;
  direction?: string;
  audioUrl?: string;
}

interface ProductTourProps {
  steps: TourStepProps[];
  isOpen: boolean;
  onClose: () => void;
  onStepChange: (target: string) => void; // Callback to notify step change
}

const ProductTourMobile: React.FC<ProductTourProps> = ({
  steps,
  isOpen,
  onClose,
  onStepChange,
}) => {
  
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDirection, setCurrentDirection] = useState('bottom');
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    top: string;
    left: string;
    transform: string;
  } | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null); 

  // Function to disable scrolling
  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  // Function to enable scrolling
  const enableScroll = () => {
    document.body.style.overflow = '';
  };

  useEffect(() => {
    if (isOpen) {
      disableScroll();
    } else {
      enableScroll();
    }

    // Cleanup on component unmount
    return () => {
      enableScroll();
    };
  }, [isOpen]);



  // const userAgent = useUserAgent();
  // const isMobile = /Mobile|Android/i.test(userAgent);

//useEffect to play audio when the step changes
  useEffect(() => {
    if (isOpen && steps.length > 0 && steps[currentStep].audioUrl) {
      const audio = new Audio(steps[currentStep].audioUrl);
      audioRef.current = audio;
      audio.play();
      // Add an event listener for when the audio ends
    
      if(currentStep !== steps.length - 1)
        {
          setTimeout(() => {
           audio.addEventListener('ended', goToNextStep);
          }
          , 700);
     

    }


      return () => {
        audio.pause();
        audio.removeEventListener('ended', goToNextStep);
      };
    }
  }, [currentStep, isOpen, steps]);


  useEffect(() => {
    if (isOpen && steps.length > 0) {
      const targetElement = document.querySelector(
        steps[currentStep].target
      ) as HTMLElement;
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setHighlightRect(rect);

        // Set modal position based on target element's position and direction
        const direction = steps[currentStep].direction || 'bottom';
        const position = calculateModalPosition(
          rect,
          direction as 'bottom' | 'top-left' | 'left' | 'right' | 'top-right' | 'bottom-center' | 'top-center'
        );
        setModalPosition(position);

        onStepChange(steps[currentStep].target); // Notify parent of step change

        // Smooth scroll to the target element
        if (!isScrolling) {
          window.scrollTo({
            top:
              rect.top +
              window.scrollY -
              window.innerHeight / 2 +
              rect.height / 2,
            behavior: 'smooth',
          });
          setIsScrolling(true);
        }
      }
    }
  }, [currentStep, isOpen, steps, isScrolling, onStepChange]);

  const calculateModalPosition = (
    rect: DOMRect,
    direction:'bottom' | 'top-left' | 'left' | 'right' | 'top-right' | 'bottom-center' | 'top-center'
  ) => {
    let top = `${rect.top + window.scrollY}px`;
    let left = `${rect.left + window.scrollX}px`;
    let transform = '';

    switch (direction) {
      case 'top-left':
        top = `${rect.top + window.scrollY - 20}px`; // Adjust modal above the target
        left = `${rect.left + window.scrollX + rect.width / 2 - 70}px`; // Center modal horizontally above target
        transform = 'translateY(-100%)';
        setCurrentDirection('top-left');
        break;
      case 'bottom':
        top = `${rect.bottom + window.scrollY + 20}px`; // Adjust modal below the target
        left = `${rect.left + window.scrollX + rect.width / 2 - 75}px`; // Center modal horizontally below target
        transform = 'translateY(0)';
        setCurrentDirection('bottom');
        break;
      case 'left':
        top = `${rect.top + window.scrollY + 60}px`; // Center modal vertically relative to target
        left = `${rect.left + window.scrollX - 20}px`; // Adjust modal to the left of the target
        transform = 'translateX(-100%)'; // Move modal left of target
        setCurrentDirection('left');
        break;
      case 'right':
        top = `${rect.top + window.scrollY + rect.height + 20}px`; // Center modal vertically relative to target
        left = `${rect.right + window.scrollX + 10}px`; // Adjust modal to the right of the target
        transform = 'translateX(0)'; // Keep modal right of target
        setCurrentDirection('right');
        break;
      case 'top-right':
        top = `${rect.bottom + window.scrollY - 250}px`; // Adjust modal below the target
        left = `${rect.left + window.scrollX  + 10}px`; // Center modal horizontally below target
        transform = 'translateY(0)';
        setCurrentDirection('top-right');
        break;
      case 'bottom-center':
        top = `${rect.bottom + window.scrollY + 80}px`; // Adjust modal below the target
        left = `${rect.left + window.scrollX + rect.width - 140}px`; // Center modal horizontally below target
        transform = 'translateY(0)';
        setCurrentDirection('bottom-center');
        break;
      case 'top-center':
        top = `${rect.top + window.scrollY - 230}px`; // Adjust modal above the target
        left = `${rect.left + window.scrollX + rect.width -280}px`; // Center modal horizontally above target
        transform = 'translateY(0)'
        setCurrentDirection('top-center');
        break
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

  const handleTourClose = () => {
    onClose();
    setCurrentStep(0);
    enableScroll();
    if (audioRef.current) {
      audioRef.current.pause();
    } // Re-enable scroll when tour is closed
  };


  const hanldeSkipClick = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
    setIsScrolling(false);
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50" />
      </div>

      {/* Modal */}
      <div
        className="fixed z-50 pointer-events-auto bg-white px-2 py-1 shadow-lg rounded-lg  max-w-[55vw] min-w-[55vw] "
        style={{
          top: modalPosition?.top,
          left: modalPosition?.left,
          transform: modalPosition?.transform,
        //   width: '300px',
        //   height: '150px',
          position: 'absolute',
        }}
      >
        <div
          className={`absolute ${
            currentDirection === 'bottom'
              ? 'top-[-30px] left-[-100px] rotate-180'
              : currentDirection === 'top-left'
              ? 'top-[90px]  left-[-90px] -scale-x-100 -rotate-12 '
              : currentDirection === 'right'
              ? 'top-[-20px] left-[-95px] rotate-[210deg]'
              : currentDirection === 'left'
              ? 'top-[-20px] right-[-90px] -scale-x-100 rotate-[160deg]'
              : currentDirection === 'top-right'
              ? 'top-[90px] right-[-85px] rotate-[25deg]'
              : currentDirection === 'bottom-center'
              ? 'top-[-80px] left-[50px] rotate-[200deg]'
              : currentDirection === 'top-center'
              ? 'top-[150px] left-[40px] -scale-x-100 rotate-[-40deg]'
              : ''
          }`}
        >
          <img
            src="curved-arrow.svg"
            alt="Profile"
            className="w-20 h-20 rounded-full mr-4"
          />
        </div>

        <div className="relative">
          <div className="w-full flex justify-end items-end mb-2">
            <button
              onClick={handleTourClose}
              className=" text-gray-600 hover:text-gray-800 transition"
            >
              {/* Cross Icon SVG */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPreviousStep}
              className="text-gray-600 hover:text-gray-800 transition"
              disabled={currentStep === 0}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-sm font-semibold">
              {steps[currentStep].title}
            </h2>

            <button
              onClick={goToNextStep}
              className="text-gray-600 hover:text-gray-800 transition"
              disabled={currentStep === steps.length - 1}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <p className="text-sm text-gray-700">
            {steps[currentStep].content}
          </p>
        </div>
        <div className='w-full flex flex-row justify-between  items-center border-t-[1px] border-gray-200'>
        <button className='text-sm  text-start  mt-2' onClick={hanldeSkipClick} disabled={currentStep === steps.length - 1}>Skip</button>
       <p className='text-sm'>step: {currentStep + 1}/{steps.length}</p>
        </div>
        
      </div>

      {/* Highlight Overlay */}
      {highlightRect && (
        <div
          className="fixed z-40 border-4 border-transparent pointer-events-none"
          style={{
            top: highlightRect.top,
            left: highlightRect.left,
            width: highlightRect.width,
            height: highlightRect.height,
          }}
        ></div>
      )}
    </>
  );
};

export default ProductTourMobile;
