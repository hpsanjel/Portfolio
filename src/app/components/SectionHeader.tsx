import React from 'react';

interface SectionHeaderProps {
  intro: string;
  title: string;
  description: string;
  as?: 'h1' | 'h2';
}

export default function SectionHeader({ intro, title, description, as = 'h2' }: SectionHeaderProps) {
  const Heading = as;
  return (
    <>
      <p className="text-center mb-2 text-lg font-Outfit">{intro}</p>
      <Heading className="text-center text-3xl md:text-4xl lg:text-5xl font-semibold bg-linear-to-r from-accent via-[#c17e0a] to-accent dark:from-[#eda40d] dark:via-[#c17e0a] dark:to-[#eda40d] bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">{title}</Heading>
      <p className="hidden md:block text-center max-w-2xl mx-auto mt-5 mb-12 font-Outfit">{description}</p>
    </>
  );
}
