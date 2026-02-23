import { Injectable } from '@nestjs/common';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import {
  BondCalculationResult,
  CashFlowEntry,
} from './interfaces/bond-result.interface';

type CouponFrequency = 'monthly' | 'quarterly' | 'semi-annual' | 'annual';

@Injectable()
export class BondService {
  private getFrequencyPerYear(frequency: CouponFrequency): number {
    switch (frequency) {
      case 'monthly':
        return 12;
      case 'quarterly':
        return 4;
      case 'semi-annual':
        return 2;
      case 'annual':
      default:
        return 1;
    }
  }

  private getMonthsPerPeriod(frequency: CouponFrequency): number {
    switch (frequency) {
      case 'monthly':
        return 1;
      case 'quarterly':
        return 3;
      case 'semi-annual':
        return 6;
      case 'annual':
      default:
        return 12;
    }
  }

  calculateCurrentYield(
    faceValue: number,
    couponRate: number,
    marketPrice: number,
  ): number {
    return ((faceValue * couponRate) / 100 / marketPrice) * 100;
  }

  calculateYtmExact(
    faceValue: number,
    couponRate: number,
    marketPrice: number,
    yearsToMaturity: number,
    frequency: CouponFrequency,
  ): number {
    const freq = this.getFrequencyPerYear(frequency);
    const C = (faceValue * (couponRate / 100)) / freq;
    const n = yearsToMaturity * freq;

    // Approximate YTM as initial guess
    const approxYtm =
      (C * freq + (faceValue - marketPrice) / (yearsToMaturity * freq)) /
      ((faceValue + marketPrice) / 2) /
      freq;

    let r = approxYtm;

    // Newton-Raphson iteration
    for (let iteration = 0; iteration < 1000; iteration++) {
      let price = 0;
      let derivative = 0;

      for (let t = 1; t <= n; t++) {
        const discountFactor = Math.pow(1 + r, t);
        price += C / discountFactor;
        derivative += (-t * C) / Math.pow(1 + r, t + 1);
      }

      const principalDiscount = Math.pow(1 + r, n);
      price += faceValue / principalDiscount;
      derivative += (-n * faceValue) / Math.pow(1 + r, n + 1);

      const diff = price - marketPrice;

      if (Math.abs(diff) < 1e-8) {
        break;
      }

      r = r - diff / derivative;
    }

    // Return annualized percentage
    return r * freq * 100;
  }

  calculateTotalInterest(
    faceValue: number,
    couponRate: number,
    yearsToMaturity: number,
  ): number {
    return ((faceValue * couponRate) / 100) * yearsToMaturity;
  }

  determineBondStatus(
    faceValue: number,
    marketPrice: number,
  ): 'premium' | 'discount' | 'par' {
    if (marketPrice > faceValue) {
      return 'premium';
    } else if (marketPrice < faceValue) {
      return 'discount';
    } else {
      return 'par';
    }
  }

  generateCashFlowSchedule(
    faceValue: number,
    couponRate: number,
    yearsToMaturity: number,
    frequency: CouponFrequency,
  ): CashFlowEntry[] {
    const freq = this.getFrequencyPerYear(frequency);
    const couponPayment = (faceValue * (couponRate / 100)) / freq;
    const totalPeriods = yearsToMaturity * freq;
    const monthsPerPeriod = this.getMonthsPerPeriod(frequency);

    const schedule: CashFlowEntry[] = [];
    let cumulativeInterest = 0;
    const today = new Date();

    for (let period = 1; period <= totalPeriods; period++) {
      cumulativeInterest += couponPayment;

      const paymentDate = new Date(today);
      paymentDate.setMonth(paymentDate.getMonth() + period * monthsPerPeriod);

      const remainingPrincipal = period === totalPeriods ? 0 : faceValue;

      schedule.push({
        period,
        paymentDate: paymentDate.toISOString(),
        couponPayment: Math.round(couponPayment * 100) / 100,
        cumulativeInterest: Math.round(cumulativeInterest * 100) / 100,
        remainingPrincipal,
      });
    }

    return schedule;
  }

  calculate(dto: CalculateBondDto): BondCalculationResult {
    const {
      faceValue,
      couponRate,
      marketPrice,
      yearsToMaturity,
      couponFrequency,
    } = dto;

    const currentYield = this.calculateCurrentYield(
      faceValue,
      couponRate,
      marketPrice,
    );

    const ytm = this.calculateYtmExact(
      faceValue,
      couponRate,
      marketPrice,
      yearsToMaturity,
      couponFrequency,
    );

    const totalInterest = this.calculateTotalInterest(
      faceValue,
      couponRate,
      yearsToMaturity,
    );

    const bondStatus = this.determineBondStatus(faceValue, marketPrice);

    const cashFlowSchedule = this.generateCashFlowSchedule(
      faceValue,
      couponRate,
      yearsToMaturity,
      couponFrequency,
    );

    return {
      currentYield: Math.round(currentYield * 100) / 100,
      ytm: Math.round(ytm * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      bondStatus,
      cashFlowSchedule,
    };
  }
}
