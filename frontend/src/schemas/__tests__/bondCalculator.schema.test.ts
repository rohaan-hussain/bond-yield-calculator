import { bondCalculatorSchema } from '../bondCalculator.schema';

describe('bondCalculatorSchema', () => {
  const validInput = {
    faceValue: 1000,
    couponRate: 5,
    marketPrice: 950,
    yearsToMaturity: 10,
    couponFrequency: 'semi-annual' as const,
  };

  it('accepts valid input', () => {
    const result = bondCalculatorSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  describe('faceValue', () => {
    it('rejects missing face value', () => {
      const { faceValue, ...rest } = validInput;
      const result = bondCalculatorSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it('rejects non-number face value', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        faceValue: 'abc',
      });
      expect(result.success).toBe(false);
    });

    it('rejects face value less than 1', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        faceValue: 0,
      });
      expect(result.success).toBe(false);
    });

    it('rejects face value exceeding 10,000,000', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        faceValue: 10_000_001,
      });
      expect(result.success).toBe(false);
    });

    it('accepts face value at minimum boundary', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        faceValue: 1,
      });
      expect(result.success).toBe(true);
    });

    it('accepts face value at maximum boundary', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        faceValue: 10_000_000,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('couponRate', () => {
    it('rejects negative coupon rate', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        couponRate: -1,
      });
      expect(result.success).toBe(false);
    });

    it('rejects coupon rate above 100', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        couponRate: 101,
      });
      expect(result.success).toBe(false);
    });

    it('accepts zero coupon rate', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        couponRate: 0,
      });
      expect(result.success).toBe(true);
    });

    it('accepts coupon rate at 100', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        couponRate: 100,
      });
      expect(result.success).toBe(true);
    });

    it('accepts decimal coupon rate', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        couponRate: 5.75,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('marketPrice', () => {
    it('rejects zero market price', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        marketPrice: 0,
      });
      expect(result.success).toBe(false);
    });

    it('rejects market price exceeding 10,000,000', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        marketPrice: 10_000_001,
      });
      expect(result.success).toBe(false);
    });

    it('accepts market price at minimum boundary (0.01)', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        marketPrice: 0.01,
      });
      expect(result.success).toBe(true);
    });

    it('accepts market price at maximum boundary', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        marketPrice: 10_000_000,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('yearsToMaturity', () => {
    it('rejects zero years', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        yearsToMaturity: 0,
      });
      expect(result.success).toBe(false);
    });

    it('rejects decimal years', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        yearsToMaturity: 5.5,
      });
      expect(result.success).toBe(false);
    });

    it('rejects years exceeding 100', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        yearsToMaturity: 101,
      });
      expect(result.success).toBe(false);
    });

    it('accepts 1 year', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        yearsToMaturity: 1,
      });
      expect(result.success).toBe(true);
    });

    it('accepts 100 years', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        yearsToMaturity: 100,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('couponFrequency', () => {
    it.each(['monthly', 'quarterly', 'semi-annual', 'annual'] as const)(
      'accepts "%s" frequency',
      (freq) => {
        const result = bondCalculatorSchema.safeParse({
          ...validInput,
          couponFrequency: freq,
        });
        expect(result.success).toBe(true);
      },
    );

    it('rejects invalid frequency', () => {
      const result = bondCalculatorSchema.safeParse({
        ...validInput,
        couponFrequency: 'weekly',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing frequency', () => {
      const { couponFrequency, ...rest } = validInput;
      const result = bondCalculatorSchema.safeParse(rest);
      expect(result.success).toBe(false);
    });
  });
});
