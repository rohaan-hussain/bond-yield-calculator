import { useState } from 'react';
import type { FormEvent } from 'react';
import type { BondInput } from '../../types/bond.types';
import { bondCalculatorSchema } from '../../schemas/bondCalculator.schema';
import Tooltip from '../ui/Tooltip';
import LoadingSpinner from '../ui/LoadingSpinner';

interface BondCalculatorFormProps {
  onSubmit: (data: BondInput) => void;
  isLoading: boolean;
}

interface FormErrors {
  faceValue?: string;
  couponRate?: string;
  marketPrice?: string;
  yearsToMaturity?: string;
  couponFrequency?: string;
}

export default function BondCalculatorForm({
  onSubmit,
  isLoading,
}: BondCalculatorFormProps) {
  const [faceValue, setFaceValue] = useState('');
  const [couponRate, setCouponRate] = useState('');
  const [marketPrice, setMarketPrice] = useState('');
  const [yearsToMaturity, setYearsToMaturity] = useState('');
  const [couponFrequency, setCouponFrequency] = useState<
    'monthly' | 'quarterly' | 'semi-annual' | 'annual'
  >('semi-annual');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const rawData = {
      faceValue: faceValue === '' ? undefined : Number(faceValue),
      couponRate: couponRate === '' ? undefined : Number(couponRate),
      marketPrice: marketPrice === '' ? undefined : Number(marketPrice),
      yearsToMaturity:
        yearsToMaturity === '' ? undefined : Number(yearsToMaturity),
      couponFrequency,
    };

    const result = bondCalculatorSchema.safeParse(rawData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  const inputClasses =
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors';
  const errorInputClasses =
    'w-full px-4 py-2 border border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 space-y-5"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Bond Parameters</h2>

      {/* Face Value */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Tooltip text="The par value of the bond, typically $1,000. This is the amount paid back at maturity.">
            Face Value ($)
          </Tooltip>
        </label>
        <input
          type="number"
          value={faceValue}
          onChange={(e) => setFaceValue(e.target.value)}
          placeholder="1000"
          className={errors.faceValue ? errorInputClasses : inputClasses}
          step="any"
        />
        {errors.faceValue && (
          <p className="mt-1 text-sm text-red-600">{errors.faceValue}</p>
        )}
      </div>

      {/* Coupon Rate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Tooltip text="The annual interest rate paid by the bond as a percentage of face value.">
            Annual Coupon Rate (%)
          </Tooltip>
        </label>
        <div className="relative">
          <input
            type="number"
            value={couponRate}
            onChange={(e) => setCouponRate(e.target.value)}
            placeholder="5.0"
            className={errors.couponRate ? errorInputClasses : inputClasses}
            step="any"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            %
          </span>
        </div>
        {errors.couponRate && (
          <p className="mt-1 text-sm text-red-600">{errors.couponRate}</p>
        )}
      </div>

      {/* Market Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Tooltip text="The current trading price of the bond in the market.">
            Market Price ($)
          </Tooltip>
        </label>
        <input
          type="number"
          value={marketPrice}
          onChange={(e) => setMarketPrice(e.target.value)}
          placeholder="950"
          className={errors.marketPrice ? errorInputClasses : inputClasses}
          step="any"
        />
        {errors.marketPrice && (
          <p className="mt-1 text-sm text-red-600">{errors.marketPrice}</p>
        )}
      </div>

      {/* Years to Maturity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Tooltip text="The number of years until the bond's principal is repaid.">
            Years to Maturity
          </Tooltip>
        </label>
        <input
          type="number"
          value={yearsToMaturity}
          onChange={(e) => setYearsToMaturity(e.target.value)}
          placeholder="10"
          className={errors.yearsToMaturity ? errorInputClasses : inputClasses}
          step="1"
        />
        {errors.yearsToMaturity && (
          <p className="mt-1 text-sm text-red-600">{errors.yearsToMaturity}</p>
        )}
      </div>

      {/* Coupon Frequency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Tooltip text="How often interest payments are made. Monthly = 12/year, Quarterly = 4/year, Semi-annual = 2/year, Annual = 1/year.">
            Coupon Frequency
          </Tooltip>
        </label>
        <div className="relative">
          <select
            value={couponFrequency}
            onChange={(e) =>
              setCouponFrequency(
                e.target.value as
                  | 'monthly'
                  | 'quarterly'
                  | 'semi-annual'
                  | 'annual',
              )
            }
            className={`appearance-none pr-10 ${errors.couponFrequency ? errorInputClasses : inputClasses}`}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="semi-annual">Semi-Annual</option>
            <option value="annual">Annual</option>
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {errors.couponFrequency && (
          <p className="mt-1 text-sm text-red-600">{errors.couponFrequency}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading && <LoadingSpinner />}
          {isLoading ? 'Calculating...' : 'Calculate Yield'}
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => {
            setFaceValue('');
            setCouponRate('');
            setMarketPrice('');
            setYearsToMaturity('');
            setCouponFrequency('semi-annual');
            setErrors({});
          }}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
