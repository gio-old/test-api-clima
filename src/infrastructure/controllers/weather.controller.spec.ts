import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from '../../domain/services/weather.service';
import { of, throwError } from 'rxjs';
import { Weather } from '../../domain/entities/weather.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('WeatherController', () => {
  let controller: WeatherController;
  let service: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            getWeatherByCity: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWeather', () => {
    it('should throw BadRequestException if city is not provided', async () => {
      try {
        await controller.getWeather('').toPromise();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('City is required');
      }
    });

    it('should return weather data when city is provided', async () => {
      const city = 'London';
      const mockWeather = new Weather(25, 60, 'Clear sky');

      (service.getWeatherByCity as jest.Mock).mockReturnValue(of(mockWeather));

      const result$ = controller.getWeather(city);
      result$.subscribe((result) => {
        expect(result).toEqual(mockWeather);
      });

      expect(service.getWeatherByCity).toHaveBeenCalledWith(city);
    });

    it('should throw InternalServerErrorException if service fails', async () => {
      const city = 'London';
    
      (service.getWeatherByCity as jest.Mock).mockReturnValue(throwError(() => new Error('Service error')));
    
      await expect(controller.getWeather(city).toPromise()).rejects.toThrow(InternalServerErrorException);
    });
    
  });
});
