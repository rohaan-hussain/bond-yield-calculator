import { Test, TestingModule } from '@nestjs/testing';
import { BondService } from './bond.service';

describe('BondService', () => {
  let service: BondService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BondService],
    }).compile();

    service = module.get<BondService>(BondService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateCurrentYield', () => {
    it('should calculate current yield for a discount bond', () => {
      const result = service.calculateCurrentYield(1000, 5, 950);
      expect(result).toBeCloseTo(5.26, 1);
    });

    it('should calculate current yield for a premium bond', () => {
      const result = service.calculateCurrentYield(1000, 5, 1050);
      expect(result).toBeCloseTo(4.76, 1);
    });

    it('should calculate current yield for a par bond', () => {
      const result = service.calculateCurrentYield(1000, 5, 1000);
      expect(result).toBeCloseTo(5.0, 2);
    });
  });

  describe('calculateYtmExact', () => {
    it('should calculate YTM for annual coupon bond', () => {
      const result = service.calculateYtmExact(1000, 5, 950, 10, 'annual');
      expect(result).toBeCloseTo(5.66, 1);
    });

    it('should calculate YTM for semi-annual coupon bond', () => {
      const result = service.calculateYtmExact(1000, 5, 950, 10, 'semi-annual');
      expect(result).toBeCloseTo(5.68, 1);
    });

    it('should return coupon rate when market price equals face value', () => {
      const result = service.calculateYtmExact(1000, 5, 1000, 10, 'annual');
      expect(result).toBeCloseTo(5.0, 1);
    });

    it('should calculate YTM for monthly coupon bond', () => {
      const result = service.calculateYtmExact(1000, 5, 950, 10, 'monthly');
      expect(result).toBeGreaterThan(5);
    });

    it('should calculate YTM for quarterly coupon bond', () => {
      const result = service.calculateYtmExact(1000, 5, 950, 10, 'quarterly');
      expect(result).toBeGreaterThan(5);
    });
  });

  describe('calculateTotalInterest', () => {
    it('should calculate total interest correctly', () => {
      const result = service.calculateTotalInterest(1000, 5, 10);
      expect(result).toBe(500);
    });

    it('should return 0 for zero coupon rate', () => {
      const result = service.calculateTotalInterest(1000, 0, 10);
      expect(result).toBe(0);
    });
  });

  describe('determineBondStatus', () => {
    it('should return discount when market price is below face value', () => {
      const result = service.determineBondStatus(1000, 950);
      expect(result).toBe('discount');
    });

    it('should return premium when market price is above face value', () => {
      const result = service.determineBondStatus(1000, 1050);
      expect(result).toBe('premium');
    });

    it('should return par when market price equals face value', () => {
      const result = service.determineBondStatus(1000, 1000);
      expect(result).toBe('par');
    });
  });

  describe('generateCashFlowSchedule', () => {
    it('should generate correct number of periods for annual frequency', () => {
      const result = service.generateCashFlowSchedule(1000, 5, 10, 'annual');
      expect(result).toHaveLength(10);
    });

    it('should generate correct number of periods for semi-annual frequency', () => {
      const result = service.generateCashFlowSchedule(
        1000,
        5,
        10,
        'semi-annual',
      );
      expect(result).toHaveLength(20);
    });

    it('should have last entry cumulative interest equal to total interest', () => {
      const totalInterest = service.calculateTotalInterest(1000, 5, 10);
      const schedule = service.generateCashFlowSchedule(1000, 5, 10, 'annual');
      const lastEntry = schedule[schedule.length - 1];
      expect(lastEntry.cumulativeInterest).toBeCloseTo(totalInterest, 2);
    });

    it('should have remaining principal of 0 on last period', () => {
      const schedule = service.generateCashFlowSchedule(1000, 5, 10, 'annual');
      const lastEntry = schedule[schedule.length - 1];
      expect(lastEntry.remainingPrincipal).toBe(0);
    });

    it('should have remaining principal equal to face value before last period', () => {
      const schedule = service.generateCashFlowSchedule(1000, 5, 10, 'annual');
      expect(schedule[0].remainingPrincipal).toBe(1000);
      expect(schedule[8].remainingPrincipal).toBe(1000);
    });

    it('should have correct coupon payment for each period', () => {
      const schedule = service.generateCashFlowSchedule(1000, 5, 10, 'annual');
      expect(schedule[0].couponPayment).toBe(50);
    });

    it('should have correct coupon payment for semi-annual', () => {
      const schedule = service.generateCashFlowSchedule(
        1000,
        5,
        10,
        'semi-annual',
      );
      expect(schedule[0].couponPayment).toBe(25);
    });

    it('should generate correct number of periods for monthly frequency', () => {
      const result = service.generateCashFlowSchedule(1000, 5, 10, 'monthly');
      expect(result).toHaveLength(120);
      expect(result[0].couponPayment).toBeCloseTo(4.17, 2);
    });

    it('should generate correct number of periods for quarterly frequency', () => {
      const result = service.generateCashFlowSchedule(1000, 5, 10, 'quarterly');
      expect(result).toHaveLength(40);
      expect(result[0].couponPayment).toBe(12.5);
    });

    it('should have valid ISO date strings for payment dates', () => {
      const schedule = service.generateCashFlowSchedule(1000, 5, 10, 'annual');
      for (const entry of schedule) {
        expect(() => new Date(entry.paymentDate)).not.toThrow();
        expect(new Date(entry.paymentDate).toISOString()).toBe(
          entry.paymentDate,
        );
      }
    });
  });

  describe('edge cases', () => {
    it('should handle zero coupon rate', () => {
      const result = service.calculateCurrentYield(1000, 0, 950);
      expect(result).toBe(0);
    });

    it('should handle zero coupon rate in cash flow schedule', () => {
      const schedule = service.generateCashFlowSchedule(1000, 0, 10, 'annual');
      expect(schedule).toHaveLength(10);
      for (const entry of schedule) {
        expect(entry.couponPayment).toBe(0);
      }
      expect(schedule[schedule.length - 1].cumulativeInterest).toBe(0);
    });
  });

  describe('calculate (orchestrator)', () => {
    it('should return a complete BondCalculationResult', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 'annual',
      });

      expect(result).toHaveProperty('currentYield');
      expect(result).toHaveProperty('ytm');
      expect(result).toHaveProperty('totalInterest');
      expect(result).toHaveProperty('bondStatus');
      expect(result).toHaveProperty('cashFlowSchedule');

      expect(result.currentYield).toBeCloseTo(5.26, 1);
      expect(result.ytm).toBeCloseTo(5.66, 1);
      expect(result.totalInterest).toBe(500);
      expect(result.bondStatus).toBe('discount');
      expect(result.cashFlowSchedule).toHaveLength(10);
    });

    it('should round all numeric values to 2 decimal places', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 'annual',
      });

      const decimalPlaces = (num: number) => {
        const str = num.toString();
        if (!str.includes('.')) return 0;
        return str.split('.')[1].length;
      };

      expect(decimalPlaces(result.currentYield)).toBeLessThanOrEqual(2);
      expect(decimalPlaces(result.ytm)).toBeLessThanOrEqual(2);
      expect(decimalPlaces(result.totalInterest)).toBeLessThanOrEqual(2);
    });

    it('should work with semi-annual frequency', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 'semi-annual',
      });

      expect(result.cashFlowSchedule).toHaveLength(20);
      expect(result.bondStatus).toBe('discount');
    });

    it('should work with monthly frequency', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 'monthly',
      });

      expect(result.cashFlowSchedule).toHaveLength(120);
      expect(result.bondStatus).toBe('discount');
    });

    it('should work with quarterly frequency', () => {
      const result = service.calculate({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 'quarterly',
      });

      expect(result.cashFlowSchedule).toHaveLength(40);
      expect(result.bondStatus).toBe('discount');
    });
  });
});
