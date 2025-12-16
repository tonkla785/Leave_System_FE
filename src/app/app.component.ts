import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { LeaveBalanceService } from './service/leave_balance.service';
import { LeaveRequestService } from './service/leave_request.service';
import { LeaveTypeService } from './service/leave_type.service';
import { ShareDataService } from './service/share_data.service';
import { UserService } from './service/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { calDateDiff } from './util/caldatediff';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatToolbarModule,
    MatCardModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private destroy$ = new Subject<void>();
  isDarkMode = false;
  isRotating = false;

  constructor(private router: Router, private balanceService: LeaveBalanceService,
    private requestService: LeaveRequestService,
    private leaveTypeService: LeaveTypeService,
    private shareDataService: ShareDataService, private userService: UserService,) { }

  ngOnInit() {
    this.fetchRequest();
    this.fetchBalance();
    this.fetchType();
    this.fetchUser();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  toggleTheme() {
    this.isRotating = true;

    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    document.body.classList.toggle('light-theme', !this.isDarkMode);

    setTimeout(() => {
      this.isRotating = false;
    }, 800);
  }

  onChange(event: MatTabChangeEvent) {
    const routes = ['', '/request-form', '/history', '/approve-request'];
    this.router.navigate([routes[event.index]]);
  }

  fetchRequest() {
    this.requestService.getAllReq().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        const data = res.data ?? [];

        data.forEach((item) => {
          item.dayDiff = calDateDiff(item.startDate, item.endDate);
        });

        const pending = data.filter(r => r.leaveStatus === 'pending');
        const approve = data.filter(r => r.leaveStatus === 'approved');
        const reject = data.filter(r => r.leaveStatus === 'rejected');

        this.shareDataService.setRequestPending(pending);
        this.shareDataService.setRequestApprove(approve);
        this.shareDataService.setRequestReject(reject);


        this.shareDataService.setAllRequest(data);
      },
      error: (err) => console.error(err),
    });
  }

  fetchBalance() {
    this.balanceService.getBalance().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        const data = res.data ?? [];
        this.shareDataService.setBalance(data);
      },
      error: (err) => console.error(err),
    });
  }

  fetchType() {
    this.leaveTypeService.getType().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        const data = res.data ?? [];
        this.shareDataService.setTypes(data);
      },
      error: (err) => console.error(err),
    });
  }

  fetchUser() {
    this.userService.getUser(1).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res.data) {
          this.shareDataService.setUser(res.data);
        }
      },
      error: (err) => console.error(err),
    });
  }
}

