import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ErrorService {
  getErrorMessage(
    errorType: string,
    errorCategory: string,
    message?: string,
  ): { message: string; status: number } {
    let errorMessage = message || 'An unexpected error occurred.';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (errorType) {
      case 'OPENWEATHER_API_ERROR':
        errorMessage =
          message || 'Error al comunicarse con la API de OpenWeatherMap.';
        status = HttpStatus.BAD_REQUEST;
        break;
      case 'OPENWEATHER_NO_RESPONSE':
        errorMessage = 'No se recibió respuesta de la API de OpenWeatherMap.';
        status = HttpStatus.GATEWAY_TIMEOUT;
        break;
      case 'OPENWEATHER_CONFIG_ERROR':
        errorMessage =
          'Error en la configuración de la solicitud a la API de OpenWeatherMap.';
        status = HttpStatus.BAD_REQUEST;
        break;
    }

    return { message: errorMessage, status };
  }

  throwHttpException(
    errorType: string,
    errorCategory: string,
    message?: string,
  ) {
    const { message: errorMessage, status } = this.getErrorMessage(
      errorType,
      errorCategory,
      message,
    );
    throw new HttpException(errorMessage, status);
  }
}
