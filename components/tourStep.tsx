import React from 'react';

interface TourStepProps {
  target: string;
  title: string;
  content: string;
}

const TourStep: React.FC<TourStepProps> = ({ target, title, content }) => (
  <div>
    {/* Optional: Render additional visual elements for each step */}
  </div>
);

export default TourStep;
