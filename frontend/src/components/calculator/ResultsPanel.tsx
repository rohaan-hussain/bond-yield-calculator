import { useRef, useState, useEffect, useCallback } from 'react';
import type { BondResult } from '../../types/bond.types';
import StatusBadge from '../ui/StatusBadge';

interface ResultsPanelProps {
  result: BondResult;
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function ResultCard({ label, value }: { label: string; value: string }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const checkTruncation = useCallback(() => {
    const el = textRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, []);

  useEffect(() => {
    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [value, checkTruncation]);

  return (
    <div className="bg-indigo-50 rounded-lg p-4">
      <p className="text-sm font-medium text-indigo-600 mb-1">{label}</p>
      <div className="relative group/value">
        <p ref={textRef} className="text-2xl font-bold text-gray-900 truncate">
          {value}
        </p>
        {isTruncated && (
          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/value:block px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg z-10 whitespace-nowrap">
            {value}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
          </span>
        )}
      </div>
    </div>
  );
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ResultCard
          label="Current Yield"
          value={formatPercent(result.currentYield)}
        />
        <ResultCard
          label="Yield to Maturity"
          value={formatPercent(result.ytm)}
        />
        <ResultCard
          label="Total Interest"
          value={formatCurrency(result.totalInterest)}
        />

        {/* Bond Status */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <p className="text-sm font-medium text-indigo-600 mb-1">
            Bond Status
          </p>
          <p className="text-2xl font-bold text-gray-900 leading-none">
            <StatusBadge status={result.bondStatus} />
          </p>
        </div>
      </div>
    </div>
  );
}
