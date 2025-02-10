import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WeatherService } from '../../domain/services/weather.service';
import { Observable, catchError } from 'rxjs';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  getWeather(@Query('city') city: string): Observable<any> {
    if (!city) {
      throw new HttpException(
        'City query parameter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.weatherService.getWeatherByCity(city).pipe(
      catchError((error) => {
        throw new HttpException(
          error.message || 'An unexpected error occurred',
          error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
