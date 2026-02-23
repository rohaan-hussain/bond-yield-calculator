import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import type { BondCalculationResult } from './../src/bond/interfaces/bond-result.interface';

describe('BondController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const validPayload = {
    faceValue: 1000,
    couponRate: 5,
    marketPrice: 950,
    yearsToMaturity: 10,
    couponFrequency: 'annual',
  };

  it('POST /api/bond/calculate - valid request returns 201 with correct response shape', () => {
    return request(app.getHttpServer())
      .post('/api/bond/calculate')
      .send(validPayload)
      .expect(201)
      .expect((res) => {
        const body = res.body as BondCalculationResult;
        expect(body).toHaveProperty('currentYield');
        expect(body).toHaveProperty('ytm');
        expect(body).toHaveProperty('totalInterest');
        expect(body).toHaveProperty('bondStatus');
        expect(body).toHaveProperty('cashFlowSchedule');
        expect(typeof body.currentYield).toBe('number');
        expect(typeof body.ytm).toBe('number');
        expect(typeof body.totalInterest).toBe('number');
        expect(typeof body.bondStatus).toBe('string');
        expect(Array.isArray(body.cashFlowSchedule)).toBe(true);
      });
  });

  it('POST /api/bond/calculate - missing fields returns 400', () => {
    return request(app.getHttpServer())
      .post('/api/bond/calculate')
      .send({
        faceValue: 1000,
      })
      .expect(400);
  });

  it('POST /api/bond/calculate - negative faceValue returns 400', () => {
    return request(app.getHttpServer())
      .post('/api/bond/calculate')
      .send({
        ...validPayload,
        faceValue: -100,
      })
      .expect(400);
  });

  it('POST /api/bond/calculate - couponRate > 100 returns 400', () => {
    return request(app.getHttpServer())
      .post('/api/bond/calculate')
      .send({
        ...validPayload,
        couponRate: 150,
      })
      .expect(400);
  });

  it('POST /api/bond/calculate - invalid couponFrequency returns 400', () => {
    return request(app.getHttpServer())
      .post('/api/bond/calculate')
      .send({
        ...validPayload,
        couponFrequency: 'weekly',
      })
      .expect(400);
  });

  it('POST /api/bond/calculate - monthly frequency returns 201', () => {
    return request(app.getHttpServer())
      .post('/api/bond/calculate')
      .send({
        ...validPayload,
        couponFrequency: 'monthly',
      })
      .expect(201)
      .expect((res) => {
        const body = res.body as BondCalculationResult;
        expect(body.cashFlowSchedule).toHaveLength(10 * 12);
      });
  });

  it('POST /api/bond/calculate - quarterly frequency returns 201', () => {
    return request(app.getHttpServer())
      .post('/api/bond/calculate')
      .send({
        ...validPayload,
        couponFrequency: 'quarterly',
      })
      .expect(201)
      .expect((res) => {
        const body = res.body as BondCalculationResult;
        expect(body.cashFlowSchedule).toHaveLength(10 * 4);
      });
  });

  it('POST /api/bond/calculate - decimal yearsToMaturity returns 400', () => {
    return request(app.getHttpServer())
      .post('/api/bond/calculate')
      .send({
        ...validPayload,
        yearsToMaturity: 5.5,
      })
      .expect(400);
  });
});
