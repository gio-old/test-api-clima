import { Controller, Get, Query, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { WeatherService } from '../../domain/services/weather.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Weather } from '../../domain/entities/weather.entity';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  getWeather(@Query('city') city: string): Observable<Weather> {
    if (!city) {
      return throwError(() => new BadRequestException('City is required'));
    }

    return this.weatherService.getWeatherByCity(city).pipe(
      catchError(() => throwError(() => new InternalServerErrorException('Failed to fetch weather data')))
    );
  }
}
