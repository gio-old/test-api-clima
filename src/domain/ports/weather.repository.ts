import { Observable } from 'rxjs';
import { Weather } from '../entities/weather.entity';

export interface WeatherRepository {
  getWeatherByCity(city: string): Observable<Weather>;
}
