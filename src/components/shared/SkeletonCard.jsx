import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-morning/30 rounded-[2.5rem] overflow-hidden border border-jade/5 animate-pulse shadow-sm">
      <div className="h-72 bg-morning/50 w-full" />
      <div className="p-8 flex flex-col gap-5">
        <div className="h-8 bg-morning rounded-xl w-3/4" />
        <div className="h-4 bg-morning rounded-lg w-1/2" />
        <div className="mt-4 flex justify-between">
          <div className="h-6 bg-morning rounded-lg w-1/3" />
          <div className="h-6 bg-morning rounded-lg w-1/4" />
        </div>
        <div className="mt-6 h-16 bg-morning rounded-2xl w-full" />
      </div>
    </div>
  );
};

export default SkeletonCard;
