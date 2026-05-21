import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-morning/30 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-jade/5 animate-pulse shadow-sm flex flex-col">
      <div className="h-36 sm:h-48 md:h-56 lg:h-64 bg-morning/50 w-full" />
      <div className="p-3 sm:p-8 flex flex-col gap-2 sm:gap-5 flex-1">
        <div className="h-5 sm:h-8 bg-morning rounded-xl w-3/4" />
        <div className="hidden sm:block h-4 bg-morning rounded-lg w-1/2" />
        <div className="mt-auto flex justify-between pt-3 sm:pt-4">
          <div className="h-4 sm:h-6 bg-morning rounded-lg w-1/3" />
          <div className="h-4 sm:h-6 bg-morning rounded-lg w-1/4" />
        </div>
        <div className="mt-4 sm:mt-6 h-8 sm:h-16 bg-morning rounded-2xl w-full" />
      </div>
    </div>
  );
};

export default SkeletonCard;
