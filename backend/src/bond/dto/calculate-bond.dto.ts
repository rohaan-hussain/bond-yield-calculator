import { IsNumber, IsPositive, IsInt, Min, Max, IsIn } from 'class-validator';

export class CalculateBondDto {
  @IsNumber()
  @IsPositive()
  faceValue!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  couponRate!: number;

  @IsNumber()
  @IsPositive()
  marketPrice!: number;

  @IsInt({ message: 'Years to maturity must be a whole number' })
  @IsPositive()
  @Max(100)
  yearsToMaturity!: number;

  @IsIn(['monthly', 'quarterly', 'semi-annual', 'annual'])
  couponFrequency!: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
}
