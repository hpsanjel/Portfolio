import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GradientButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  className?: string;
  showArrow?: boolean;
  children?: React.ReactNode;
}

export default function GradientButton({
  text,
  href,
  onClick,
  type = 'button',
  disabled = false,
  target = '_self',
  rel,
  className = '',
  showArrow = true,
  children
}: GradientButtonProps) {
  const baseClasses = "group px-10 py-3 border rounded-full bg-linear-to-r from-[#eda40d] to-[#c17e0a] text-white font-semibold flex items-center gap-2 dark:border-transparent shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden";
  const disabledClasses = disabled ? "disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg" : "";
  const combinedClasses = `${baseClasses} ${disabledClasses} ${className}`;

  const buttonContent = (
    <>
      <span className="relative z-10">{text}</span>
      {showArrow && (
        <Image 
          src="/images/arrow-right-white.svg" 
          alt="arrow icon" 
          width={20} 
          height={20} 
          className="w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" 
        />
      )}
      <div className="absolute inset-0 bg-linear-to-r from-[#c17e0a] to-[#eda40d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {children}
    </>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        target={target}
        rel={rel}
        className={combinedClasses}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {buttonContent}
    </button>
  );
}
