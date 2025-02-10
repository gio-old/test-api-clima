import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureModule } from './infrastructure.module';
import { OpenWeatherMapAdapter } from '../adapters/open-weather-map.adapter';
import { ErrorService } from '../../domain/services/error.service';
import { HttpModule } from '@nestjs/axios';

describe('InfrastructureModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [InfrastructureModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide OpenWeatherMapAdapter', () => {
    const adapter = module.get<OpenWeatherMapAdapter>(OpenWeatherMapAdapter);
    expect(adapter).toBeDefined();
  });

  it('should provide ErrorService', () => {
    const errorService = module.get<ErrorService>(ErrorService);
    expect(errorService).toBeDefined();
  });

  it('should import HttpModule', () => {
    const httpModule = module.get(HttpModule);
    expect(httpModule).toBeDefined();
  });

  it('should export OpenWeatherMapAdapter', () => {
    const adapter = module.get<OpenWeatherMapAdapter>(OpenWeatherMapAdapter); 
    expect(adapter).toBeDefined(); 
  });
});
