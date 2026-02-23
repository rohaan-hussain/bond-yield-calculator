import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BondModule } from './bond/bond.module';

@Module({
  imports: [ConfigModule.forRoot(), BondModule],
})
export class AppModule {}
