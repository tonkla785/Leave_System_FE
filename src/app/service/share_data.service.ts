import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataFromDashBoard } from '../interface/data_interface';

@Injectable({
  providedIn: 'root',
})
export class ShareDataService {
  private _summary$ = new BehaviorSubject<DataFromDashBoard>({
    maxDay: 0,
    sumLeaveDay: 0,
    remainDay: 0,
  });

  summary$ = this._summary$.asObservable();

  setData(data: DataFromDashBoard) {
    this._summary$.next(data);
  }

  getData(): DataFromDashBoard {
    return this._summary$.value;
  }
}
