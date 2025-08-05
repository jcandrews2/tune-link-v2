import React from "react";
import type { ReactNode } from "react";

interface ChartProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ title, children, className = "" }) => {
  const isEmpty =
    !children || (Array.isArray(children) && children.length === 0);

  return (
    <div
      className={`w-full py-4 pl-4 pr-2 border border-gray-700 rounded-lg flex flex-col bg-black h-full ${className}`}
    >
      <h2 className='text-xl font-semibold text-white mb-4'>{title}</h2>
      <div className='flex-1 overflow-y-auto pr-2'>
        {isEmpty ? (
          <p className='text-gray-400 text-center'>No data yet.</p>
        ) : (
          <div className='space-y-4'>{children}</div>
        )}
      </div>
    </div>
  );
};

export default Chart;
