import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { OpenWeatherMapAdapter } from '../../infrastructure/adapters/open-weather-map.adapter';
import { HttpModule } from '@nestjs/axios';
import { ErrorService } from '../../domain/services/error.service';
import { of, throwError } from 'rxjs';
import { Weather } from '../entities/weather.entity';

describe('WeatherService', () => {
  let service: WeatherService;
  let adapter: OpenWeatherMapAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        WeatherService,
        ErrorService,
        {
          provide: OpenWeatherMapAdapter,
          useValue: {
            getWeatherByCity: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    adapter = module.get<OpenWeatherMapAdapter>(OpenWeatherMapAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return weather data when city exists', async () => {
    const city = 'London';
    const mockWeather = new Weather(29.81, 38, 'clear sky');
    (adapter.getWeatherByCity as jest.Mock).mockReturnValue(of(mockWeather));

    const result = await service.getWeatherByCity(city).toPromise();

    expect(result).toEqual(mockWeather);
  });

  it('should handle city not found', async () => {
    const city = 'NonExistentCity';
    const errorMessage = 'City not found';
    (adapter.getWeatherByCity as jest.Mock).mockReturnValue(throwError(() => new Error(errorMessage)));

    try {
      await service.getWeatherByCity(city).toPromise(); 
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });

  it('should handle service unavailable', async () => {
    const city = 'London';
    const errorMessage = 'Service unavailable';
    (adapter.getWeatherByCity as jest.Mock).mockReturnValue(throwError(() => new Error(errorMessage)));

    try {
      await service.getWeatherByCity(city).toPromise(); 
    } catch (error) {
      expect(error.message).toEqual(errorMessage); 
    }
  });

  it('should handle no response from server', async () => {
    const city = 'London';
    const errorMessage = 'No response from server';
    (adapter.getWeatherByCity as jest.Mock).mockReturnValue(throwError(() => new Error(errorMessage)));

    try {
      await service.getWeatherByCity(city).toPromise(); 
    } catch (error) {
      expect(error.message).toEqual(errorMessage); 
    }
  });

  it('should handle city does not exist', async () => {
    const city = 'NonExistentCity';
    const errorMessage = 'City does not exist';
    (adapter.getWeatherByCity as jest.Mock).mockReturnValue(throwError(() => new Error(errorMessage)));

    try {
      await service.getWeatherByCity(city).toPromise(); 
    } catch (error) {
      expect(error.message).toEqual(errorMessage); 
    }
  });


  it('should throw error when city is empty', async () => {
    const city = '';

    try {
      await service.getWeatherByCity(city).toPromise();
    } catch (error) {
      expect(error.message).toEqual('City parameter is required');
    }
  });
});