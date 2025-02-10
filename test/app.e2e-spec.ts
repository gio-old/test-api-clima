import { OpenWeatherMapAdapter } from '../src/infrastructure/adapters/open-weather-map.adapter';
import { ErrorService } from '../src/domain/services/error.service';
import { of, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';

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

  it('should return weather data when API request is successful', async () => {
    const mockResponse = {
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
    };

    (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

    const result = await adapter.getWeatherByCity('London').toPromise();

    expect(result).toEqual(mockResponse);
    expect(httpService.get).toHaveBeenCalledWith(
      expect.stringContaining('London'), // Verifica que la URL contenga 'London'
      expect.objectContaining({ params: { units: 'metric' } }), // Verifica que los parámetros incluyan 'units: metric'
    );
  });

  it('should throw HttpException when API returns an error', async () => {
    const mockError = {
      response: { status: 400, data: { message: 'City not found' } },
    };

    (httpService.get as jest.Mock).mockReturnValue(throwError(() => mockError));

    try {
      await adapter.getWeatherByCity('NonExistentCity').toPromise();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual(mockError.response.data.message);
      expect(error.getStatus()).toEqual(mockError.response.status);
    }
  });

  it('should throw HttpException when API request fails', async () => {
    const mockError = new Error('Network Error');

    (httpService.get as jest.Mock).mockReturnValue(throwError(() => mockError));

    try {
      await adapter.getWeatherByCity('NonExistentCity').toPromise();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual(
        'Error al comunicarse con la API de OpenWeatherMap.',
      ); // Mensaje de error esperado
      expect(error.getStatus()).toEqual(500); // Código de estado esperado
    }
  });

  it('should throw HttpException when API returns an empty response', async () => {
    const mockResponse = {};

    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    try {
      await adapter.getWeatherByCity('NonExistentCity').toPromise();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Empty response from OpenWeatherMap API'); // Mensaje de error esperado
      expect(error.getStatus()).toEqual(500); // Código de estado esperado
    }
  });

  it('should throw HttpException when API returns an invalid response', async () => {
    const mockResponse = { cod: '404', message: 'city not found' };

    (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

    try {
      await adapter.getWeatherByCity('NonExistentCity').toPromise();
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual(mockResponse.message); // Mensaje de error esperado
      expect(error.getStatus()).toEqual(404); // Código de estado esperado
    }
  });
});
