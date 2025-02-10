import { Injectable } from '@nestjs/common';
import { OpenWeatherMapAdapter } from '../../infrastructure/adapters/open-weather-map.adapter';
import { Weather } from '../entities/weather.entity';
import { Observable } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherRepository: OpenWeatherMapAdapter) {}

  getWeatherByCity(city: string): Observable<Weather> {
    if (!city) {
      throw new Error('City parameter is required');
    }

    return this.weatherRepository.getWeatherByCity(city);
  }
}
