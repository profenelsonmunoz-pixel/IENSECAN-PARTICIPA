import React, { useState, useEffect } from 'react';
import { getStructuredContent } from './services/geminiService';
import type { PageContent, ContactMethod, Mechanism } from './types';
import { LOGO_URL } from './constants';
import { GlobeAltIcon, PhoneIcon, EnvelopeIcon, BuildingOfficeIcon, UserGroupIcon, QuestionMarkCircleIcon } from './components/Icons';
import ContactCard from './components/ContactCard';
import MechanismCard from './components/MechanismCard';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMechanism, setActiveMechanism] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const structuredContent = await getStructuredContent();
        setContent(structuredContent);
        setError(null);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("No se pudo cargar el contenido. Por favor, intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);
  
  const getIconForMethod = (type: string) => {
    switch (type) {
      case 'Presencial':
        return <BuildingOfficeIcon className="h-8 w-8 text-white" />;
      case 'Telefónico':
        return <PhoneIcon className="h-8 w-8 text-white" />;
      case 'Virtual':
        return <GlobeAltIcon className="h-8 w-8 text-white" />;
      case 'Correo Electrónico':
        return <EnvelopeIcon className="h-8 w-8 text-white" />;
      default:
        return <QuestionMarkCircleIcon className="h-8 w-8 text-white" />;
    }
  };

  const toggleMechanism = (title: string) => {
    setActiveMechanism(activeMechanism === title ? null : title);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-center sm:justify-start space-x-4">
          <img src={LOGO_URL} alt="Logo de la Institución" className="h-16 w-16 object-contain" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 hidden sm:block">
            I.E. Nuestra Señora de la Candelaria
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : content ? (
          <>
            <section className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{content.mainTitle}</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{content.introduction}</p>
            </section>

            <section className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {content.contactMethods.map((method: ContactMethod) => (
                  // FIX: Added the missing 'type' prop to ContactCard to match its props interface.
                  <ContactCard 
                    key={method.type} 
                    type={method.type}
                    title={method.title}
                    details={method.details}
                    icon={getIconForMethod(method.type)}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-blue-600 p-3 rounded-full">
                        <UserGroupIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{content.mechanismsTitle}</h3>
                </div>
                <div className="space-y-4">
                  {content.mechanisms.map((mechanism: Mechanism) => (
                    <MechanismCard 
                      key={mechanism.title}
                      title={mechanism.title}
                      description={mechanism.description}
                      isOpen={activeMechanism === mechanism.title}
                      onToggle={() => toggleMechanism(mechanism.title)}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : null}
      </main>
      
      <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
        <p>Desarrollado con IA para una mejor experiencia de usuario.</p>
      </footer>
    </div>
  );
};

export default App;