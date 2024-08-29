import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onStartTour }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4">
        <h2 className="text-2xl font-semibold mb-4">Let&apos; Start with Basic Information</h2>
        <p className="mb-6">Welcome to the tour! Click the button below to start the guided tour of this page.</p>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={onStartTour}
          >
            Start Tour
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
