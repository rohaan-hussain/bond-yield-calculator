import { useBondCalculator } from '../hooks/useBondCalculator';
import BondCalculatorForm from '../components/calculator/BondCalculatorForm';
import ResultsPanel from '../components/calculator/ResultsPanel';
import CashFlowTable from '../components/calculator/CashFlowTable';

export default function CalculatorPage() {
  const { result, isLoading, calculate } = useBondCalculator();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BondCalculatorForm onSubmit={calculate} isLoading={isLoading} />
        {result && <ResultsPanel result={result} />}
      </div>
      {result && <CashFlowTable schedule={result.cashFlowSchedule} />}
    </div>
  );
}
