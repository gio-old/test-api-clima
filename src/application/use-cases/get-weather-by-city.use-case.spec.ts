/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { GetWeatherByCity } from './get-weather-by-city.use-case';
import { WeatherRepository } from '../../domain/ports/weather.repository';
import { Weather } from '../../domain/entities/weather.entity';
import { of, throwError } from 'rxjs';

describe('GetWeatherByCity', () => {
  let useCase: GetWeatherByCity;
  let weatherRepository: WeatherRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetWeatherByCity,
        {
          provide: 'WeatherRepository',
          useValue: {
            getWeatherByCity: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetWeatherByCity>(GetWeatherByCity);
    weatherRepository = module.get<WeatherRepository>('WeatherRepository');
  });

  it('should return weather for a given city', async () => {
    const mockWeather = new Weather(25, 60, 'Clear sky');
    jest
      .spyOn(weatherRepository, 'getWeatherByCity')
      .mockReturnValue(of(mockWeather));

    const result$ = useCase.execute('London');

    result$.subscribe((result) => {
      expect(result).toEqual(mockWeather);
    });

    expect(weatherRepository.getWeatherByCity).toHaveBeenCalledWith('London');
  });

  it('should throw error if city does not exist', () => {
    const city = 'NonExistentCity';
    const errorMessage = 'City not found';

    jest
      .spyOn(weatherRepository, 'getWeatherByCity')
      .mockReturnValue(throwError(() => new Error(errorMessage)));

    const result$ = useCase.execute(city);

    result$.subscribe({
      next: () => fail('Should not reach here'),
      error: (error) => {
        expect(error.message).toEqual(errorMessage);
      },
      complete: () => fail('Should not complete'),
    });

    expect(weatherRepository.getWeatherByCity).toHaveBeenCalledWith(city);
  });

  it('should throw error if service fails', async () => {
    const city = 'London';
    const errorMessage = 'Service unavailable';

    jest
      .spyOn(weatherRepository, 'getWeatherByCity')
      .mockReturnValue(throwError(() => new Error(errorMessage)));

    const result$ = useCase.execute(city);

    result$.subscribe({
      next: () => fail('Should not reach here'),
      error: (error) => {
        expect(error.message).toEqual(errorMessage);
      },
      complete: () => fail('Should not complete'),
    });

    expect(weatherRepository.getWeatherByCity).toHaveBeenCalledWith(city);
  });
});
