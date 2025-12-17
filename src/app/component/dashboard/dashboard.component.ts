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
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FullCalendarModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatTableModule,
    StatusPipe,
    StatusClassPipe,
    ThDatePipe,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
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

  selectedDepartment?: string;
  departments: string[] = ['Intern', 'Help'];

  constructor(private shareDataService: ShareDataService) {}

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
      this.shareDataService.requestAll$.subscribe((data) => {
        this.dataSource.data = data;
        this.prepareCalendarEvents();
        this.dataSource.sort = this.sort;
      })
    );
  }

  subscribeDataPending() {
    this.sub.add(
      this.shareDataService.requestPending$.subscribe((data) => {
        this.pendingData = data.length;
      })
    );
  }

  subscribeDataBalance() {
    this.sub.add(
      this.shareDataService.balance$.subscribe((data) => {
        this.dataBalanceOP = data;
      })
    );
  }

  subscribeDataTypes() {
    this.sub.add(
      this.shareDataService.types$.subscribe((data) => {
        this.dataTypeOP = data;
      })
    );
  }

  subscribeSummary() {
    this.sub.add(
      this.shareDataService.summary$.subscribe((summary) => {
        this.maxDay = summary.maxDay;
        this.remainDay = summary.remainDay;
        this.sumLeaveDay = summary.sumLeaveDay;
      })
    );
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    height: 650,
    headerToolbar: {
      left: 'myPrev,myTitle,myNext',
      center: '',
      right: 'legend',
    },
    customButtons: {
      myPrev: {
        text: '<',
        click: () => {
          const calendarApi = this.calendarComponent.getApi();
          calendarApi.prev();
        },
      },
      myNext: {
        text: '>',
        click: () => {
          const calendarApi = this.calendarComponent.getApi();
          calendarApi.next();
        },
      },
      myTitle: {
        text: '',
        click: () => {},
      },
      legend: {
        text: '',
        click: () => {},
      },
    },
    locale: 'th',
    dayHeaderFormat: { weekday: 'short' },
    datesSet: (info) => {
      const titleButton = document.querySelector('.fc-myTitle-button');
      if (titleButton) {
        const month = info.start.toLocaleString('th-TH', { month: 'long' });
        const yearBE = info.start.getFullYear() + 543;
        titleButton.textContent = `${month} ${yearBE}`;
      }

      const legendButton = document.querySelector('.fc-legend-button');
      if (legendButton) {
        legendButton.innerHTML = `
          <span style="display:flex; gap:8px; align-items:center;">
            <span style="width:12px; height:12px; background:pink; border-radius:3px;"></span> ลาป่วย
            <span style="width:12px; height:12px; background:lightblue; border-radius:3px;"></span> ลาพักร้อน
            <span style="width:12px; height:12px; background:yellow; border-radius:3px;"></span> ลากิจ
          </span>
        `;
      }
    },
  };

  prepareCalendarEvents() {
    this.calendarOptions.events = this.dataSource.data.map((req) => ({
      title: req.user.userName,
      start: req.startDate,
      end: req.endDate
        ? new Date(new Date(req.endDate).getTime() + 86400000)
        : req.startDate,
      color: this.getLeaveTypeColor(req.leaveTypeEntity.typeName),
      textColor: 'black',
      allDay: true,
    }));
  }

  getLeaveTypeColor(type: string) {
    const colors: any = {
      SICK: 'pink',
      VACATION: 'lightblue',
      CASUAL: 'yellow',
    };
    return colors[type] ?? 'gray';
  }
}
