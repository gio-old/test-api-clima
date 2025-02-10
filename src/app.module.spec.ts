import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { WeatherController } from './infrastructure/controllers/weather.controller';
import { WeatherService } from './domain/services/weather.service';
import { ErrorService } from './domain/services/error.service';
import { InfrastructureModule } from './infrastructure/config/infrastructure.module';
import { ConfigModule } from '@nestjs/config';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import InfrastructureModule', () => {
    const infrastructureModule = module.get(InfrastructureModule);
    expect(infrastructureModule).toBeDefined();
  });

  it('should import ConfigModule', () => {
    const configModule = module.get(ConfigModule);
    expect(configModule).toBeDefined();
  });

  it('should provide WeatherController', () => {
    const controller = module.get<WeatherController>(WeatherController);
    expect(controller).toBeDefined();
  });

  it('should provide WeatherService', () => {
    const service = module.get<WeatherService>(WeatherService);
    expect(service).toBeDefined();
  });

  it('should provide ErrorService', () => {
    const errorService = module.get<ErrorService>(ErrorService);
    expect(errorService).toBeDefined();
  });
});
