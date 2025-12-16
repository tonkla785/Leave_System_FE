import { Component } from '@angular/core';
import { ShareDataService } from '../../service/share_data.service';
import {
  DataFromDashBoard,
  LeaveType,
  User,
  PayloadRequest,
} from '../../interface/data_interface';
import { UserService } from '../../service/user.service';
import { LeaveRequestService } from '../../service/leave_request.service';
import { LeaveTypeService } from '../../service/leave_type.service';
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
import { Subscription } from 'rxjs';
import { alertMessage } from '../../util/alertmessage';
import { NgForm, NgModel } from '@angular/forms';

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
  userData: User[] = [];

  fromInput: PayloadRequest = {
    userId: undefined,
    leaveTypeId: undefined,
    startDate: undefined,
    endDate: undefined,
    reason: undefined,
  };

  constructor(
    private shareDataService: ShareDataService,
    private userService: UserService,
    private leaveRequestService: LeaveRequestService,
    private leaveTypeService: LeaveTypeService
  ) {}

  shareData!: DataFromDashBoard;
  private summarySub!: Subscription;

  ngOnInit(): void {
    this.fetchType();
    this.fetchUser();
    this.fetchSumFormDash();
  }

  ngOnDestroy(): void {
    this.summarySub.unsubscribe();
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

  fetchUser() {
    this.userService.getUser(1).subscribe({
      next: (res) => {
        const user = res.data;
        if (user) {
          this.userData = [user];
          this.fromInput.userId = user.id;
        }
        console.log('User:', this.userData);
        console.log('fromInput.userId:', this.fromInput.userId);
      },
      error: (err) => console.error(err),
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

    console.log('Payload to send:', this.fromInput);

    this.leaveRequestService.createRequest(this.fromInput).subscribe({
      next: (res) => {
        this.clearScreen(form);
        alertMessage();
        console.log('Leave submitted:', res);
      },
      error: (err) => console.error(err),
    });
  }

  fetchSumFormDash() {
    this.summarySub = this.shareDataService.summary$.subscribe((data) => {
      this.shareData = data;
      console.log('Summary from dashboard:', data);
    });
  }

  cancelData(form: NgForm) {
    this.clearScreen(form);
  }

  clearScreen(form?: NgForm) {
    this.fromInput = {
      userId: this.userData[0]?.id,
      leaveTypeId: undefined,
      startDate: undefined,
      endDate: undefined,
      reason: undefined,
    };

    if (form) {
      form.resetForm({
        userId: this.userData[0]?.id,
        leaveTypeId: undefined,
        startDate: undefined,
        endDate: undefined,
        reason: undefined,
      });
    }
  }
}
