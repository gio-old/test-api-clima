import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure/config/infrastructure.module';
import { WeatherController } from './infrastructure/controllers/weather.controller';
import { WeatherService } from './domain/services/weather.service';
import { ConfigModule } from '@nestjs/config';
import { ErrorService } from './domain/services/error.service';

@Module({
  imports: [
    InfrastructureModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [WeatherController],
  providers: [WeatherService, ErrorService],
})
export class AppModule {}
