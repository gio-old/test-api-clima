import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenWeatherMapAdapter } from '../adapters/open-weather-map.adapter';
import { ErrorService } from '../../domain/services/error.service'; // Importa ErrorService

@Module({
  imports: [HttpModule],
  providers: [OpenWeatherMapAdapter, ErrorService], // Proporciona ErrorService
  exports: [OpenWeatherMapAdapter],
})
export class InfrastructureModule {}
