import type { CashFlowEntry } from '../../types/bond.types';

interface CashFlowTableProps {
  schedule: CashFlowEntry[];
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function CashFlowTable({ schedule }: CashFlowTableProps) {
  if (schedule.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Cash Flow Schedule
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Payment Date</th>
              <th className="px-4 py-3 text-right">Coupon Payment</th>
              <th className="px-4 py-3 text-right">Cumulative Interest</th>
              <th className="px-4 py-3 text-right">Remaining Principal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedule.map((entry) => (
              <tr
                key={entry.period}
                className="even:bg-gray-50 hover:bg-indigo-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {entry.period}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {formatDate(entry.paymentDate)}
                </td>
                <td className="px-4 py-3 text-right text-gray-900">
                  {formatCurrency(entry.couponPayment)}
                </td>
                <td className="px-4 py-3 text-right text-gray-900">
                  {formatCurrency(entry.cumulativeInterest)}
                </td>
                <td className="px-4 py-3 text-right text-gray-900">
                  {formatCurrency(entry.remainingPrincipal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
