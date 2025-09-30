
import React from 'react';
import { ChevronDownIcon } from './Icons';

interface MechanismCardProps {
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
}

const MechanismCard: React.FC<MechanismCardProps> = ({ title, description, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
        <ChevronDownIcon 
          className={`h-6 w-6 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
      >
        <div className="p-4 bg-white text-gray-600 border-t border-gray-200">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default MechanismCard;
