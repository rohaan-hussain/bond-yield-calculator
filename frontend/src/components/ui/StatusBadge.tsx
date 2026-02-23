interface StatusBadgeProps {
  status: 'premium' | 'discount' | 'par';
}

const badgeStyles: Record<StatusBadgeProps['status'], string> = {
  par: 'bg-green-100 text-green-800 border-green-300',
  premium: 'bg-amber-100 text-amber-800 border-amber-300',
  discount: 'bg-red-100 text-red-800 border-red-300',
};

const labels: Record<StatusBadgeProps['status'], string> = {
  par: 'Par',
  premium: 'Premium',
  discount: 'Discount',
};

const descriptions: Record<StatusBadgeProps['status'], string> = {
  par: 'Bond is trading at face value',
  premium: 'Bond is trading above face value',
  discount: 'Bond is trading below face value',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className="relative group/badge inline-flex">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border cursor-help ${badgeStyles[status]}`}
      >
        {labels[status]}
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/badge:block px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg z-10 whitespace-nowrap">
        {descriptions[status]}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
      </span>
    </span>
  );
}
