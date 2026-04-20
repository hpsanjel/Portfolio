import React from 'react';

interface SectionHeaderProps {
  intro: string;
  title: string;
  description: string;
}

export default function SectionHeader({ intro, title, description }: SectionHeaderProps) {
  return (
    <>
      <p className="text-center mb-2 text-lg font-Outfit">{intro}</p>
      <h2 className="text-center text-5xl font-Outfit bg-linear-to-r from-[#eda40d] via-[#c17e0a] to-[#eda40d] bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">{title}</h2>
      <p className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Outfit">{description}</p>
    </>
  );
}
