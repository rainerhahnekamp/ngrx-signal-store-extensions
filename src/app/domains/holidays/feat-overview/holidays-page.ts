import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { HolidaysStore } from './data/holidays-store';
import { HolidayCard } from './ui/holiday-card/holiday-card';

@Component({
  selector: 'app-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <div
      class="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-white px-4 py-3.5 shadow-sm"
    >
      <div class="flex min-w-0 items-center gap-3 text-slate-700">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-slate-600"
        >
          <mat-icon class="!text-[20px] !leading-none">schedule</mat-icon>
        </div>
        <div class="min-w-0">
          <div
            class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500"
          >
            Last update
          </div>
          <div class="truncate text-sm font-medium tabular-nums text-slate-900">
            {{ holidaysStore.lastUpdatedName() }}
          </div>
        </div>
      </div>
      <button
        mat-flat-button
        color="primary"
        type="button"
        class="shrink-0 !inline-flex items-center gap-2 !px-4"
        (click)="holidaysStore.syncToStorage()"
      >
        <mat-icon>cloud_download</mat-icon>
        Save for offline
      </button>
    </div>
    <form (ngSubmit)="handleSearch()">
      <div class="flex items-baseline">
        <mat-form-field>
          <mat-label>Search</mat-label>
          <input
            data-testid="inp-search"
            [(ngModel)]="search"
            matInput
            name="search"
          />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-radio-group
          [(ngModel)]="type"
          name="type"
          color="primary"
          class="mx-4"
        >
          <mat-radio-button value="0">All</mat-radio-button>
          <mat-radio-button value="1">City</mat-radio-button>
          <mat-radio-button value="2">Country</mat-radio-button>
        </mat-radio-group>
        <button color="primary" mat-raised-button>Search</button>
      </div>
    </form>
    <div class="flex flex-wrap justify-evenly">
      @for (holiday of holidaysStore.holidays(); track holiday.id) {
        <app-holiday-card
          [holiday]="holiday"
          (addFavourite)="addFavourite($event)"
          (removeFavourite)="removeFavourite($event)"
        >
        </app-holiday-card>
      }
    </div> `,
  imports: [
    HolidayCard,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioGroup,
    MatRadioButton,
    MatButton,
    HolidayCard,
  ],
})
export class HolidaysPage {
  protected readonly holidaysStore = inject(HolidaysStore);
  protected readonly search = '';
  protected readonly type = '0';

  protected addFavourite(id: number) {
    this.holidaysStore.addFavourite(id);
  }

  protected removeFavourite(id: number) {
    this.holidaysStore.removeFavourite(id);
  }

  protected handleSearch() {
    this.holidaysStore.search(this.search, Number(this.type));
  }
}
