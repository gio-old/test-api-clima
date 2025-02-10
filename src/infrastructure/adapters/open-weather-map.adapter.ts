import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { WeatherRepository } from '../../domain/ports/weather.repository';

import { Weather } from '../../domain/entities/weather.entity';
import { ErrorService } from '../../domain/services/error.service';

@Injectable()
export class OpenWeatherMapAdapter implements WeatherRepository {
  private readonly apiKey = process.env.OPENWEATHER_API_KEY || '';
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(
    private readonly httpService: HttpService,
    @Inject(ErrorService) private readonly errorService: ErrorService,
  ) {}

  getWeatherByCity(city: string): Observable<Weather> {
    const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;

    return this.httpService.get(url).pipe(
      map((response) => {
        const data = response.data;
        return new Weather(
          data.main?.temp ?? 0,
          data.main?.humidity ?? 0,
          data.weather?.[0]?.description ?? 'No description available',
        );
      }),
      catchError((error: unknown) => {
        if (error instanceof AxiosError && error.response) {
          const errorMessage =
            (error.response.data as { message?: string })?.message ||
            'Unknown error';
          this.errorService.throwHttpException(
            'OPENWEATHER_API_ERROR',
            'API_ERROR',
            errorMessage,
          );
          return throwError(() => new Error(errorMessage));
        } else {
          this.errorService.throwHttpException('OPENWEATHER_ERROR', 'DEFAULT');
          return throwError(() => new Error());
        }
      }),
    );
  }
}
