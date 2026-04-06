import { inject, signal } from '@angular/core';
import { Holiday } from '../model/holiday';
import { MessageService } from '../../../shared/ui-messaging/message/message.service';

abstract class BaseStore<T = Record<string, unknown>> {
  getState(): T {
    return {} as T;
  }

  patchState(value: Partial<T>) {
    void value;
  }
}

abstract class LocalStorageStore extends BaseStore {
  private readonly messageService = inject(MessageService);

  constructor(private storageKey: string) {
    super();
  }

  syncToStorage() {
    const state = this.getState();
    localStorage.setItem(this.storageKey, JSON.stringify(state));
    this.messageService.info('Holidays saved for offline usage');
  }

  loadFromStorage() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return;
    }

    const state = JSON.parse(data);
    this.patchState(state);
  }
}

abstract class FinalStore extends LocalStorageStore {
  private readonly _favouriteIds = signal([] as number[]);
  public readonly favouriteIds = this._favouriteIds.asReadonly();
}

export class HolidaysStoreClass extends FinalStore {
  constructor() {
    super('holidays');
  }
  private readonly _holidays = signal([] as Holiday[]);
  public readonly holidays = this._holidays.asReadonly();
}
