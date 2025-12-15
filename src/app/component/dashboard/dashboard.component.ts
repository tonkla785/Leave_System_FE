import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { LeaveBalanceService } from '../../service/leave_balance.service';
import { LeaveRequestService } from '../../service/leave_request.service';
import { StatusPipe } from '../../pipe/status.pipe';
import {
  LeaveBalance,
  LeaveRequest,
  LeaveType,
} from '../../interface/data_interface';
import { LeaveTypeService } from '../../service/leave_type.service';
import { StatusClassPipe } from '../../pipe/status-class.pipe';
import { ThDatePipe } from '../../pipe/th-date.pipe';
import { MatSort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { calDateDiff } from '../../util/caldatediff';

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
    MatSortModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'date', 'type', 'amount', 'status'];

  dataSource = new MatTableDataSource<LeaveRequest>([]);

  dataRequest: LeaveRequest = {
    Id: undefined,
    startDate: undefined,
    endDate: undefined,
    leaveStatus: '',
    leaveReason: '',
    dayDiff:undefined,
    user: {
      Id: undefined,
      userName: '',
      userEmail: '',
      userRole: '',
      userDepartment: '',
    },
    leaveTypeEntity: {
      Id: undefined,
      typeName: '',
      typeDescription: '',
      maxDay: undefined,
    },
  };

  dataType: LeaveType = {
    Id: undefined,
    typeName: '',
    typeDescription: '',
    maxDay: undefined,
  };

  dataBalance: LeaveBalance = {
    Id: undefined,
    leaveYear: undefined,
    remainDay: undefined,
  };

  pendingData: number = 0;
  dataBalanceOP: LeaveBalance[] = [];
  dataTypeOP: LeaveType[] = [];

  maxDay: number = 0;
  sumLeaveDay: number = 0;
  remainDay: number = 0;

  constructor(
    private balanceService: LeaveBalanceService,
    private requestService: LeaveRequestService,
    private leaveTypeService: LeaveTypeService
  ) { }

  ngOnInit(): void {
    this.fetchType();
    this.fetchBalance();
    this.fetchReqPending();
    this.fetchRequest();
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
    });
  }


  fetchRequest() {
    this.requestService.getAllReq().subscribe({
      next: (res) => {
        const data = res.data ?? [];

        data.forEach(item => {
          item.dayDiff = calDateDiff(item.startDate, item.endDate);
        });

        this.dataSource.data = data;
        console.log('Request:', this.dataSource.data);
      },
      error: (err) => console.error(err),
    });
  }

  fetchBalance() {
    this.balanceService.getBalance().subscribe({
      next: (res) => {
        this.dataBalanceOP = res.data ?? [];
        this.calculateDayRemain();
        console.log('Balance:', this.dataBalanceOP);
      },
      error: (err) => console.error(err),
    });
  }

  fetchType() {
    this.leaveTypeService.getType().subscribe({
      next: (res) => {
        this.dataTypeOP = res.data ?? [];
        this.maxDay = this.sumMaxDay();
        console.log('Types:', this.dataTypeOP);
      },
      error: (err) => console.error(err),
    });
  }

  fetchReqPending() {
    this.requestService.getStatusPending().subscribe({
      next: (res) => {
        this.pendingData = res.data?.length ?? 0;
        console.log('Pending:', this.pendingData);
      },
      error: (err) => console.error(err)
    })
  }

  sumMaxDay(): number {
    let total = 0;

    this.dataTypeOP.forEach(item => {
      total += item.maxDay ?? 0;
    });

    return total;
  }

  calculateDayRemain(): void {
    let total = 0;
    let year = 0;
    this.dataBalanceOP.forEach(item => {
      total += item.remainDay ?? 0;
      year += item.leaveYear ?? 0;
    });
    this.remainDay = this.maxDay - total;
    this.sumLeaveDay = year;
  }
}
