import React from "react";
import type { ReactNode } from "react";

interface ChartProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ title, children, className = "" }) => {
  // Check if children is empty (null, undefined, empty array, or false)
  const isEmpty =
    !children || (Array.isArray(children) && children.length === 0);

  return (
    <div className={`w-1/3 ${className}`}>
      <div className='w-full py-4 pl-4 pr-2 border border-gray-700 rounded-lg h-full flex flex-col'>
        <div className='flex justify-between items-center mb-4 pr-2'>
          <h2 className='text-xl font-semibold'>{title}</h2>
        </div>
        <div className='flex-1 overflow-y-auto pr-2'>
          {isEmpty ? (
            <p className='text-gray-400 text-center'>No data yet.</p>
          ) : (
            <div className='space-y-4'>{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chart;
