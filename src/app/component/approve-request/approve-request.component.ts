import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StatusPipe } from '../../pipe/status.pipe';
import { StatusClassPipe } from '../../pipe/status-class.pipe';
import { CommonModule } from '@angular/common';
import { LeaveRequestService } from '../../service/leave_request.service';
import { LeaveBalanceService } from '../../service/leave_balance.service';
import { LeaveRequest, PayloadBalance, User } from '../../interface/data_interface';
import { ShareDataService } from '../../service/share_data.service';
import { alertErrorMessage, alertMessage } from '../../util/alertmessage';

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
  userData: User | null = null;

  payloadBalance: PayloadBalance = {
    userId: undefined,
    leaveTypeId: undefined,
    year: undefined,
    remainDay: undefined,
  }

  constructor(
    private shareDataService: ShareDataService,
    private leaveRequestService: LeaveRequestService,
    private leaveBalanceService: LeaveBalanceService
  ) { }

  ngOnInit(): void {
    this.subscribeDataPending()
  }

  subscribeDataPending() {
    this.shareDataService.requestPending$.subscribe(data => {
      this.dataRequest = data;
      this.pendingData = data.length;
    });
  }

  subscribeDataUser() {
    this.shareDataService.user$.subscribe(data => {
      this.userData = data;
    });
  }

  rejectReq(req: LeaveRequest) {
    if (!req.id) return;

    this.leaveRequestService
      .updateRequest(req.id, 'rejected')
      .subscribe({
        next: () => {
          const updatedReq: LeaveRequest = {
            ...req,
            leaveStatus: 'rejected',
          };

          this.shareDataService.updateRequest(updatedReq);
          alertMessage();
        },
        error: err => {
          alertErrorMessage("Reject failed")
          console.error(err);
        },
      });
  }

  confirmReq(req: LeaveRequest) {
    if (!req.id) return alertErrorMessage("Confirm Fail");

    this.leaveRequestService.updateRequest(req.id, 'approved')
      .subscribe({
        next: () => {

          this.payloadBalance = {
            userId: req.user.id!,
            leaveTypeId: req.leaveTypeEntity.id!,
            year: req.dayDiff ?? 0,
            remainDay: req.dayDiff ?? 0,
          };

          this.leaveBalanceService.createBalance(this.payloadBalance)
            .subscribe({
              next: () => {
                this.leaveBalanceService.getBalance()
                  .subscribe(res => {
                    this.shareDataService.setBalance(res.data);
                  });
                this.shareDataService.updateRequest({
                  ...req,
                  leaveStatus: 'approved',
                });
                alertMessage();
              },
              error: err => { console.error(err); alertErrorMessage('Create balance failed') }
            });

        },
        error: err => { console.error(err); alertErrorMessage('Approve failed') }
      });
  }
}
