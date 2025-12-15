import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'อนุมัติ' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'อนุมัติ' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'รออนุมัติ' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'รออนุมัติ' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'ไม่อนุมัติ' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'ไม่อนุมัติ' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'ไม่อนุมัติ' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'ไม่อนุมัติ' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'ไม่อนุมัติ' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'ไม่อนุมัติ' },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatTableModule,
    StatusPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  displayedColumns: string[] = ['date', 'type', 'amount', 'status'];
  dataSource = ELEMENT_DATA;

  dataRequest: LeaveRequest = {
    Id: undefined,
    startDate: undefined,
    endDate: undefined,
    leaveStatus: '',
    leaveReason: '',
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

  dataRequestOP: LeaveRequest[] = [];
  dataBalanceOP: LeaveBalance[] = [];
  dataTypeOP: LeaveType[] = [];

  constructor(
    private balanceService: LeaveBalanceService,
    private requestService: LeaveRequestService,
    private leaveTypeService: LeaveTypeService
  ) {}

  ngOnInit(): void {
    this.fetchRequest();
    this.fetchBalance();
    this.fetchType();
  }

  fetchRequest() {
    this.requestService.getAllReq().subscribe({
      next: (res) => {
        this.dataRequestOP = res.data ?? [];
        console.log('Requests:', this.dataRequestOP);
      },
      error: (err) => console.error(err),
    });
  }

  fetchBalance() {
    this.balanceService.getBalance().subscribe({
      next: (res) => {
        this.dataBalanceOP = res.data ?? [];
        console.log('Balance:', this.dataBalanceOP);
      },
      error: (err) => console.error(err),
    });
  }

  fetchType() {
    this.leaveTypeService.getType().subscribe({
      next: (res) => {
        this.dataTypeOP = res.data ?? [];
        console.log('Types:', this.dataTypeOP);
      },
      error: (err) => console.error(err),
    });
  }
}
