import { Injectable, Inject } from '@nestjs/common';
import { WeatherRepository } from '../../domain/ports/weather.repository';
import { Weather } from '../../domain/entities/weather.entity';
import { Observable } from 'rxjs';

@Injectable()
export class GetWeatherByCity {
  constructor(
    @Inject('WeatherRepository')
    private readonly weatherRepository: WeatherRepository,
  ) {}

  execute(city: string): Observable<Weather> {
    return this.weatherRepository.getWeatherByCity(city);
  }
}
