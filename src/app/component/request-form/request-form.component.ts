import { Component } from '@angular/core';
import { ShareDataService } from '../../service/share_data.service';
import {
  LeaveType,
  User,
  PayloadRequest,
} from '../../interface/data_interface';
import { LeaveRequestService } from '../../service/leave_request.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { alertMessage } from '../../util/alertmessage';
import { NgForm, NgModel } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { calDateDiff } from '../../util/caldatediff';


@Component({
  selector: 'app-request-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
  ],
  templateUrl: './request-form.component.html',
  styleUrl: './request-form.component.css',
})
export class RequestFormComponent {
  today = new Date();

  dataTypeOP: LeaveType[] = [];
  userData: User | null = null;

  fromInput: PayloadRequest = {
    userId: undefined,
    leaveTypeId: undefined,
    startDate: undefined,
    endDate: undefined,
    reason: undefined,
  };

  private destroy$ = new Subject<void>();

  constructor(
    private shareDataService: ShareDataService,
    private leaveRequestService: LeaveRequestService
  ) { }

  ngOnInit(): void {
    this.subscribeDataTypes();
    this.subscribeDataUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  subscribeDataTypes() {
    this.shareDataService.types$
      .pipe(takeUntil(this.destroy$))
      .subscribe(types => {
        this.dataTypeOP = types;
      });
  }

  subscribeDataUser() {
    this.shareDataService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        if (users) {
          this.userData = users;
          this.fromInput.userId = this.userData.id;
        }
      });
  }

  submitLeave(
    form: NgForm,
    leaveTypeCtrl: NgModel,
    startDateCtrl: NgModel,
    endDateCtrl: NgModel,
    reasonCtrl: NgModel
  ) {
    leaveTypeCtrl.control.markAsTouched();
    startDateCtrl.control.markAsTouched();
    endDateCtrl.control.markAsTouched();
    reasonCtrl.control.markAsTouched();

    if (form.invalid) return;

    this.leaveRequestService.createRequest(this.fromInput).subscribe({
      next: (res) => {
        alertMessage();
        this.clearScreen(form);
        res.data.dayDiff = calDateDiff(
          res.data.startDate,
          res.data.endDate
        );
        this.shareDataService.addNewRequest(res.data);
      },
      error: (err) => console.error(err),
    });
  }

  cancelData(form: NgForm) { this.clearScreen(form); }

  clearScreen(form?: NgForm) {
    this.fromInput.leaveTypeId = undefined;
    this.fromInput.startDate = undefined;
    this.fromInput.endDate = undefined;
    this.fromInput.reason = undefined;

    form?.resetForm({
      leaveTypeId: undefined,
      startDate: undefined,
      endDate: undefined,
      reason: undefined,
    });

    this.fromInput.userId = this.userData?.id;
  }

}

