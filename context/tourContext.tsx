'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import ProductTour from '../components/tour/productTour';
import ProductTourMobile from '../components/tour/productTourMobile';

interface TourStepProps {
  target: string;
  title: string;
  content: string;
  direction?: string;
  audioUrl?: string;
}

interface TourContextProps {
  steps: TourStepProps[];
  isOpen: boolean;
  currentTarget: string;
  //onClose: () => void;
  onStepChange: (target: string) => void;
  setSteps: React.Dispatch<React.SetStateAction<TourStepProps[]>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  //setOnClose: React.Dispatch<React.SetStateAction<() => void>>;
  setOnStepChange: React.Dispatch<React.SetStateAction<(target: string) => void>>;
}

const TourContext = createContext<TourContextProps | undefined>(undefined);

export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [steps, setSteps] = useState<TourStepProps[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTarget, setCurrentTarget] = useState<string>("");
  const [onClose, setOnClose] = useState<() => void>(() => () => {});
 const [onStepChange, setOnStepChange] = useState<(target: string) => void>(() => () => {});

  const useUserAgent = () => {
    const [userAgent, setUserAgent] = useState("");

    useEffect(() => {
      setUserAgent(navigator.userAgent);
    }, []);

    return userAgent;
  };

  const userAgent = useUserAgent();

  const isMobile = /Mobile|Android/i.test(userAgent);


  const onTourClose = () => {

    setIsOpen(false);
    setCurrentTarget("");

  };


  const handleTourStepChange = (target: string) => {
    setCurrentTarget(target);
  };
 
  return (
    <TourContext.Provider value={{ steps, isOpen, onStepChange, setSteps, setIsOpen, setOnStepChange, currentTarget }}>
      {children}
     
     
      {isMobile ? (
        <div>
          <ProductTourMobile
      steps={steps} isOpen={isOpen} onClose={onTourClose} onStepChange={handleTourStepChange}
          />
        </div>
      ) : (
        <div>
          <ProductTour
          steps={steps} isOpen={isOpen} onClose={onTourClose} onStepChange={handleTourStepChange}
          />
        </div>
      )}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
