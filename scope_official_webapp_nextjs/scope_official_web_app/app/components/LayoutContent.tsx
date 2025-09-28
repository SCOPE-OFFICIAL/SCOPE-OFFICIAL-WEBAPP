"use client";

import { useModal } from './ModalContext';
import Navigation from './Navigation';
import FooterComponent from './FooterComponent';
import PageTransitionWrapper from './PageTransitionWrapper';

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { isModalOpen } = useModal();

  return (
    <>
      {/* Navigation - hidden when modal is open */}
      <div className={`transition-opacity duration-300 ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Navigation />
      </div>
      
      {/* Page Content with Transition Wrapper */}
      <main className="flex-grow">
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </main>

      {/* Footer - hidden when modal is open */}
      <div className={`transition-opacity duration-300 ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <FooterComponent />
      </div>
    </>
  );
}