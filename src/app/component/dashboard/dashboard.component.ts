import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { StatusPipe } from '../../pipe/status.pipe';
import {
  LeaveBalance,
  LeaveRequest,
  LeaveType,
} from '../../interface/data_interface';
import { StatusClassPipe } from '../../pipe/status-class.pipe';
import { ThDatePipe } from '../../pipe/th-date.pipe';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { ShareDataService } from '../../service/share_data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatTableModule,
    StatusPipe,
    StatusClassPipe,
    ThDatePipe,
    MatSortModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  @ViewChild(MatSort) sort!: MatSort;
  private sub = new Subscription();

  displayedColumns: string[] = ['id', 'date', 'type', 'amount', 'status'];

  dataSource = new MatTableDataSource<LeaveRequest>([]);

  pendingData: number = 0;

  maxDay: number = 0;
  sumLeaveDay: number = 0;
  remainDay: number = 0;

  dataBalanceOP: LeaveBalance[] = [];
  dataTypeOP: LeaveType[] = [];

  constructor(
    private shareDataService: ShareDataService
  ) { }

  ngOnInit(): void {
    this.subscribeDataRequests();
    this.subscribeDataPending();
    this.subscribeDataBalance();
    this.subscribeDataTypes();
    this.subscribeSummary();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'date') {
        return new Date(item.startDate ?? '').getTime();
      }
      return (item as any)[property];
    };

    Promise.resolve().then(() => {
      this.sort.active = 'id';
      this.sort.direction = 'desc';
      this.sort.sortChange.emit();
    });
  }

  subscribeDataRequests() {
    this.sub.add(
      this.shareDataService.requestAll$.subscribe(data => {
        this.dataSource.data = data;

        this.dataSource.sort = this.sort;
      })
    );
  }

  subscribeDataPending() {
    this.sub.add(
      this.shareDataService.requestPending$.subscribe(data => {
        this.pendingData = data.length;
      })
    );
  }

  subscribeDataBalance() {
    this.sub.add(
      this.shareDataService.balance$.subscribe(data => {
        this.dataBalanceOP = data;
      })
    );
  }

  subscribeDataTypes() {
    this.sub.add(
      this.shareDataService.types$.subscribe(data => {
        this.dataTypeOP = data;
      })
    );
  }

  subscribeSummary() {
    this.sub.add(
      this.shareDataService.summary$.subscribe(summary => {
        this.maxDay = summary.maxDay;
        this.remainDay = summary.remainDay;
        this.sumLeaveDay = summary.sumLeaveDay;
      })
    );
  }
}
