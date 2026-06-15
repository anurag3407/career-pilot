import React from 'react';
import Cover from './Cover';
import PartsList from './PartsList';
import AssemblySteps from './AssemblySteps';
import Troubleshooting from './Troubleshooting';

export default function IKEA_Assembly_Manual() {
  return (
    <div className="min-h-screen bg-[#f4f4f0] font-sans text-black py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <Cover />
        <PartsList />
        <AssemblySteps />
        <Troubleshooting />
      </div>
    </div>
  );
}
