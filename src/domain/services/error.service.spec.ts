/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorService } from './error.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    service = new ErrorService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return default error message with 500 status', () => {
    const result = service.getErrorMessage('UNKNOWN_ERROR', 'DEFAULT');
    expect(result).toEqual({
      message: 'An unexpected error occurred.',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it('should return OPENWEATHER_API_ERROR message with 400 status', () => {
    const result = service.getErrorMessage(
      'OPENWEATHER_API_ERROR',
      'API_ERROR',
    );
    expect(result).toEqual({
      message: 'Error al comunicarse con la API de OpenWeatherMap.',
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('should return OPENWEATHER_NO_RESPONSE message with 504 status', () => {
    const result = service.getErrorMessage(
      'OPENWEATHER_NO_RESPONSE',
      'API_ERROR',
    );
    expect(result).toEqual({
      message: 'No se recibió respuesta de la API de OpenWeatherMap.',
      status: HttpStatus.GATEWAY_TIMEOUT,
    });
  });

  it('should return OPENWEATHER_CONFIG_ERROR message with 400 status', () => {
    const result = service.getErrorMessage(
      'OPENWEATHER_CONFIG_ERROR',
      'API_ERROR',
    );
    expect(result).toEqual({
      message:
        'Error en la configuración de la solicitud a la API de OpenWeatherMap.',
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('should return custom message with specified status', () => {
    const result = service.getErrorMessage(
      'OPENWEATHER_API_ERROR',
      'API_ERROR',
      'Custom error message',
    );
    expect(result).toEqual({
      message: 'Custom error message',
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('should throw HttpException with correct message and status', () => {
    expect(() =>
      service.throwHttpException('OPENWEATHER_API_ERROR', 'API_ERROR'),
    ).toThrowError(HttpException);

    try {
      service.throwHttpException('OPENWEATHER_API_ERROR', 'API_ERROR');
    } catch (error) {
      expect(error.message).toEqual(
        'Error al comunicarse con la API de OpenWeatherMap.',
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('should throw HttpException with correct message and status for OPENWEATHER_CONFIG_ERROR', () => {
    expect(() =>
      service.throwHttpException('OPENWEATHER_CONFIG_ERROR', 'API_ERROR'),
    ).toThrowError(HttpException);

    try {
      service.throwHttpException('OPENWEATHER_CONFIG_ERROR', 'API_ERROR');
    } catch (error) {
      expect(error.message).toEqual(
        'Error en la configuración de la solicitud a la API de OpenWeatherMap.',
      );
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });
});
