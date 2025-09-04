'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'nav';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: string;
  rel?: string;
}

export default function AnimatedButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  href,
  target,
  rel
}: AnimatedButtonProps) {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white';
      case 'secondary':
        return 'bg-white/15 backdrop-blur-sm text-white border border-white/20';
      case 'outline':
        return 'bg-transparent border-2 border-[#2C97FF] text-[#2C97FF] hover:text-white';
      case 'nav':
        return 'bg-white/15 backdrop-blur-sm text-white hover:text-white shadow-md border border-white/20';
      default:
        return 'bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center rounded-full font-medium 
    transition-all duration-300 ease-in-out whitespace-nowrap 
    group relative overflow-hidden shadow-lg
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  const buttonContent = (
    <>
      {/* Expanding blue dot animation - only for non-primary variants */}
      {variant !== 'primary' && (
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-[#2C97FF] rounded-full transition-all duration-700 ease-out origin-center group-hover:w-20 group-hover:h-20 group-hover:left-1/2 group-hover:top-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:scale-[3] group-hover:bg-[#2C97FF] group-hover:rounded-full"></span>
      )}
      
      {/* Gradient overlay for outline variant */}
      {variant === 'outline' && (
        <span className="absolute inset-0 bg-gradient-to-r from-[#F24DC2] to-[#2C97FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
      )}
      
      <span className="relative z-10 flex items-center">
        {/* Invisible spacer for dot positioning - only for non-primary variants */}
        {variant !== 'primary' && (
          <span className="w-1.5 h-1.5 mr-2 opacity-0"></span>
        )}
        
        {children}
        
        {/* Arrow icon - appears on hover */}
        <svg
          className="w-2.5 h-2.5 flex-shrink-0 transition-all duration-300 ml-0 opacity-0 group-hover:opacity-100 group-hover:ml-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
    </>
  );

  const motionProps = {
    whileHover: { scale: disabled ? 1 : 1.05 },
    whileTap: { scale: disabled ? 1 : 0.95 },
    transition: { type: "spring" as const, stiffness: 400, damping: 10 }
  };

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        className={baseClasses}
        onClick={disabled ? undefined : onClick}
        {...motionProps}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...motionProps}
    >
      {buttonContent}
    </motion.button>
  );
}
