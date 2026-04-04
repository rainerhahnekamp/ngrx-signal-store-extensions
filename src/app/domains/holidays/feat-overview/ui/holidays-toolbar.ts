import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-holidays-toolbar',
  imports: [MatIconModule],
  template: `
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
            {{ lastUpdatedName() }}
          </div>
        </div>
      </div>
      <button
        mat-flat-button
        color="primary"
        type="button"
        class="shrink-0 !inline-flex items-center gap-2 !px-4"
        (click)="saveForOffline.emit()"
      >
        <mat-icon>cloud_download</mat-icon>
        Save for offline
      </button>
    </div>
  `,
})
export class HolidaysToolbar {
  public readonly lastUpdatedName = input.required<string>();

  public readonly saveForOffline = output<void>();
}
