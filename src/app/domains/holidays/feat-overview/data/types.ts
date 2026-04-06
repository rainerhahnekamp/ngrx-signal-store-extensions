import { Holiday } from '../../model/holiday';
import { HolidayFilter } from '../model/model';

export interface HolidaysOwnState {
  _holidays: Holiday[];
  isLoaded: boolean;
  filter: HolidayFilter;
}
