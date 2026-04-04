import { Holiday } from '../../model/holiday';

export interface HolidayFilter {
  query: string;
  type: number;
}

export interface HolidayWithFavourite extends Holiday {
  isFavourite: boolean;
}
