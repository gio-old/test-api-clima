import { OpenWeatherMapAdapter } from './open-weather-map.adapter';
import { HttpException } from '@nestjs/common';
import { ErrorService } from '../../domain/services/error.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Weather } from '../../domain/entities/weather.entity';
import { AxiosError } from 'axios';

describe('OpenWeatherMapAdapter', () => {
  let adapter: OpenWeatherMapAdapter;
  let httpService: HttpService;
  let errorService: ErrorService;

  beforeEach(() => {
    httpService = { get: jest.fn() } as unknown as HttpService;
    errorService = { throwHttpException: jest.fn() } as unknown as ErrorService;
    adapter = new OpenWeatherMapAdapter(httpService, errorService);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should return weather data when city exists', async () => {
    const mockResponse: AxiosResponse = {
      data: {
        coord: { lon: -0.1277, lat: 51.5074 },
        weather: [
          { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
        ],
        base: 'stations',
        main: {
          temp: 288.15,
          feels_like: 287.89,
          temp_min: 287.04,
          temp_max: 289.26,
          pressure: 1013,
          humidity: 81,
        },
        visibility: 10000,
        wind: { speed: 4.1, deg: 80 },
        clouds: { all: 0 },
        dt: 1678886400,
        sys: {
          type: 1,
          id: 1414,
          country: 'GB',
          sunrise: 1678868487,
          sunset: 1678908201,
        },
        timezone: 0,
        id: 2643743,
        name: 'London',
        cod: 200,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };

    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    const expectedWeather = new Weather(
      mockResponse.data.main.temp,
      mockResponse.data.main.humidity,
      mockResponse.data.weather[0].description,
    );

    const result = await adapter.getWeatherByCity('London').toPromise();

    expect(result).toEqual(expectedWeather);
    expect(httpService.get).toHaveBeenCalledWith(
      'https://api.openweathermap.org/data/2.5/weather?q=London&appid=&units=metric',
    );
  });

  it('should throw HttpException when API returns an empty response', async () => {
    const mockResponse: AxiosResponse = {
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };

    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    try {
      await adapter.getWeatherByCity('NonExistentCity').toPromise();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Empty response from OpenWeatherMap API');
      expect(error.getStatus()).toEqual(500);
    }
  });

  it('should throw HttpException when city is not found', async () => {
    const mockError = new AxiosError(
      'Request failed with status code 404',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 404,
        data: { message: 'city not found' },
      } as any
    );
  
    (httpService.get as jest.Mock).mockReturnValue(throwError(() => mockError));
  
    try {
      await adapter.getWeatherByCity('InvalidCity').toPromise();
    } catch (error) {
      expect(errorService.throwHttpException).toHaveBeenCalledWith(
        'OPENWEATHER_API_ERROR',
        'API_ERROR',
        'city not found'
      );
    }
  });
  

});
