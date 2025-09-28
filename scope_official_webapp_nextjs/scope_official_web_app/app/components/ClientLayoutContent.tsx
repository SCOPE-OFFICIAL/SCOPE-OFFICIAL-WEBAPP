"use client";

import { useModal } from '../contexts/ModalContext';
import Navigation from './Navigation';
import FooterComponent from './FooterComponent';
import PageTransitionWrapper from './PageTransitionWrapper';

interface ClientLayoutContentProps {
  children: React.ReactNode;
}

export default function ClientLayoutContent({ children }: ClientLayoutContentProps) {
  const { isModalOpen } = useModal();

  return (
    <>
      {/* Navigation - hidden when modal is open */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isModalOpen 
            ? 'opacity-0 pointer-events-none transform -translate-y-full' 
            : 'opacity-100 transform translate-y-0'
        }`}
      >
        <Navigation />
      </div>
      
      {/* Page Content with Transition Wrapper */}
      <main className="flex-grow">
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </main>

      {/* Footer - hidden when modal is open */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isModalOpen 
            ? 'opacity-0 pointer-events-none transform translate-y-full' 
            : 'opacity-100 transform translate-y-0'
        }`}
      >
        <FooterComponent />
      </div>
    </>
  );
}