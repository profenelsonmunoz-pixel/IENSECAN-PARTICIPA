
import React from 'react';
import type { ContactMethod } from '../types';

interface ContactCardProps extends ContactMethod {
  icon: React.ReactNode;
}

const ContactCard: React.FC<ContactCardProps> = ({ title, details, icon }) => {
  const mapUrl = (query: string) => 
    `https://www.google.com/maps/embed/v1/place?key=${process.env.API_KEY}&q=${encodeURIComponent(query)}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300">
      <div className="flex items-center mb-4">
        <div className="bg-blue-600 p-3 rounded-full mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="flex-grow space-y-3 text-gray-700">
        {details.map((detail, index) => (
          <div key={index} className="flex flex-col">
            <span className="font-semibold text-sm text-gray-500">{detail.label}:</span>
            {detail.isMap ? (
              <div className="mt-1 aspect-w-16 aspect-h-9">
                <iframe
                  src={mapUrl(detail.value)}
                  className="w-full h-48 rounded-lg border-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa de ubicación para ${detail.label}`}
                ></iframe>
              </div>
            ) : detail.isLink ? (
              <a 
                href={detail.value} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 hover:underline break-words"
              >
                {detail.value.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]}...
              </a>
            ) : (
               <span className="break-words">{detail.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactCard;
