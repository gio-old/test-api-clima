import { Test, TestingModule } from '@nestjs/testing';
import { GetWeatherByCity } from './get-weather-by-city.use-case';
import { WeatherRepository } from '../../domain/ports/weather.repository';
import { Weather } from '../../domain/entities/weather.entity';

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
      .mockResolvedValue(mockWeather);

    const result = await useCase.execute('London');
    expect(result).toEqual(mockWeather);
    expect(weatherRepository.getWeatherByCity).toHaveBeenCalledWith('London');
  });
});
