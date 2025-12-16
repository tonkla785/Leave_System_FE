import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { LeaveBalance, LeaveRequest, LeaveType, User } from '../interface/data_interface';

@Injectable({
  providedIn: 'root',
})
export class ShareDataService {

  private _balance$ = new BehaviorSubject<LeaveBalance[]>([]);
  balance$ = this._balance$.asObservable();

  private _types$ = new BehaviorSubject<LeaveType[]>([]);
  types$ = this._types$.asObservable();

  private _requestAll$ = new BehaviorSubject<LeaveRequest[]>([]);
  requestAll$ = this._requestAll$.asObservable();

  private _requestPending$ = new BehaviorSubject<LeaveRequest[]>([]);
  requestPending$ = this._requestPending$.asObservable();

  private _requestApprove$ = new BehaviorSubject<LeaveRequest[]>([]);
  requestApprove$ = this._requestApprove$.asObservable();

  private _requestReject$ = new BehaviorSubject<LeaveRequest[]>([]);
  requestReject$ = this._requestReject$.asObservable();

  private _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  summary$ = combineLatest([
    this.types$,
    this.balance$,
  ]).pipe(
    map(([types, balances]) => {
      const maxDay = types.reduce(
        (sum, t) => sum + (t.maxDay ?? 0), 0
      );

      const usedDay = balances.reduce(
        (sum, b) => sum + (b.remainDay ?? 0), 0
      );

      const sumLeaveDay = balances.reduce(
        (sum, b) => sum + (b.leaveYear ?? 0), 0
      );

      return {
        maxDay,
        remainDay: maxDay - usedDay,
        sumLeaveDay,
      };
    })
  );

  addNewRequest(req: LeaveRequest) {
    this._requestAll$.next([...this._requestAll$.value, req]);

    switch (req.leaveStatus) {
      case 'pending':
        this._requestPending$.next([...this._requestPending$.value, req]);
        break;
      case 'approved':
        this._requestApprove$.next([...this._requestApprove$.value, req]);
        break;
      case 'rejected':
        this._requestReject$.next([...this._requestReject$.value, req]);
        break;
    }
  }

  setRequestPending(data: LeaveRequest[]) {
    this._requestPending$.next(data);
  }

  setRequestApprove(data: LeaveRequest[]) {
    this._requestApprove$.next(data);
  }

  setRequestReject(data: LeaveRequest[]) {
    this._requestReject$.next(data);
  }

  setBalance(data: LeaveBalance[]) {
    this._balance$.next(data);
  }

  addBalance(item: LeaveBalance) {
    this._balance$.next([...this._balance$.value, item]);
  }

  setAllRequest(data: LeaveRequest[]) {
    this._requestAll$.next(data);
  }

  updateRequest(updated: LeaveRequest) {
    const all = this._requestAll$.value.map(r =>
      r.id === updated.id ? updated : r
    );
    this._requestAll$.next(all);

    this._requestPending$.next(all.filter(r => r.leaveStatus === 'pending'));
    this._requestApprove$.next(all.filter(r => r.leaveStatus === 'approved'));
    this._requestReject$.next(all.filter(r => r.leaveStatus === 'rejected'));
  }

  setUser(data: User) {
    this._user$.next(data);
  }

  setTypes(data: LeaveType[]) {
    this._types$.next(data);
  }
}
