import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StatusPipe } from '../../pipe/status.pipe';
import { StatusClassPipe } from '../../pipe/status-class.pipe';
import { CommonModule } from '@angular/common';
import { LeaveRequestService } from '../../service/leave_request.service';
import { LeaveBalanceService } from '../../service/leave_balance.service';
import { LeaveTypeService } from '../../service/leave_type.service';
import { LeaveRequest } from '../../interface/data_interface';
import { calDateDiff } from '../../util/caldatediff';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-approve-request',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    StatusPipe,
    StatusClassPipe,
    CommonModule,
  ],
  templateUrl: './approve-request.component.html',
  styleUrl: './approve-request.component.css',
})
export class ApproveRequestComponent {
  pendingData: number = 0;

  dataRequest: LeaveRequest[] = [];

  constructor(
    private balanceService: LeaveBalanceService,
    private requestService: LeaveRequestService,
    private leaveTypeService: LeaveTypeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchReqPending();
  }

  fetchReqPending() {
    this.requestService.getStatusPending().subscribe({
      next: (res) => {
        const data = res.data ?? [];
        this.dataRequest = data;
        this.dataRequest.forEach((item) => {
          item.dayDiff = calDateDiff(item.startDate, item.endDate);
        });

        this.pendingData = res.data?.length ?? 0;
        console.log('Pending:', res.data);
      },
      error: (err) => console.error(err),
    });
  }

  rejectReq(){
    
  }

  confirmReq(){

  }
}
