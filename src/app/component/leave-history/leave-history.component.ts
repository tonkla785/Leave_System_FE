import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { LeaveRequest } from '../../interface/data_interface';
import { ShareDataService } from '../../service/share_data.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, registerables, Chart } from 'chart.js';
import * as XLSX from 'xlsx';


Chart.register(...registerables);

interface ChartData {
  type: string;
  days: number;
}

@Component({
  selector: 'app-leave-history',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatTableModule,
    BaseChartDirective
  ],
  templateUrl: './leave-history.component.html',
  styleUrl: './leave-history.component.css',
})
export class LeaveHistoryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['userName', 'department', 'Sick', 'Vacation', 'Personal', 'total'];
  dataSource = new MatTableDataSource<any>([]);
  chartData: ChartData[] = [];

  date: Date = new Date();

  selectedMonth: Date | null = null;
  selectedDepartment?: string;
  departments: string[] = [];

  private sub = new Subscription();
  allApprovedRequests: LeaveRequest[] = [];

  constructor(private shareDataService: ShareDataService) { }

  ngOnInit(): void {
    this.sub.add(
      this.shareDataService.requestApprove$.subscribe((data) => {
        this.allApprovedRequests = data;
        this.departments = Array.from(new Set(data.map((r) => r.user.userDepartment)));
        this.applyFilters();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public barChartLabels: string[] = [];
  public barChartData = [
    { data: [] as number[], label: 'จำนวนวันลา' }
  ];
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
    },
  };

  chosenYearHandler(normalizedYear: Date) {
    if (!this.selectedMonth) {
      this.selectedMonth = new Date();
    }
    this.selectedMonth.setFullYear(normalizedYear.getFullYear());
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: any) {
    if (!this.selectedMonth) {
      this.selectedMonth = new Date();
    }
    this.selectedMonth.setMonth(normalizedMonth.getMonth());
    datepicker.close();
    this.applyFilters();
  }

  applyFilters() {
    const filtered = this.filterByMonthAndDepartment();
    this.dataSource.data = this.generateTableData(filtered);
    this.generateChartData(filtered);
  }

  private filterByMonthAndDepartment(): LeaveRequest[] {
    return this.allApprovedRequests.filter(r => {
      let monthMatch = true;
      let departmentMatch = true;

      if (this.selectedMonth) {
        const month = this.selectedMonth.getMonth();
        const year = this.selectedMonth.getFullYear();
        const start = new Date(r.startDate!);
        const end = new Date(r.endDate!);
        monthMatch =
          (start.getMonth() === month && start.getFullYear() === year) ||
          (end.getMonth() === month && end.getFullYear() === year);
      }

      if (this.selectedDepartment) {
        departmentMatch = r.user.userDepartment === this.selectedDepartment;
      }

      return monthMatch && departmentMatch;
    });
  }

  private generateTableData(filtered: LeaveRequest[]) {
    const tableMap: Record<string, any> = {};
    filtered.forEach(r => {
      const key = r.user.userName + '_' + r.user.userDepartment;
      if (!tableMap[key]) {
        tableMap[key] = {
          userName: r.user.userName,
          department: r.user.userDepartment,
          Sick: 0,
          Vacation: 0,
          Personal: 0,
          total: 0,
        };
      }

      const typeDesc = r.leaveTypeEntity.typeDescription;
      if (typeDesc.includes('ป่วย')) tableMap[key].Sick += r.dayDiff ?? 0;
      else if (typeDesc.includes('พักร้อน')) tableMap[key].Vacation += r.dayDiff ?? 0;
      else tableMap[key].Personal += r.dayDiff ?? 0;

      tableMap[key].total += r.dayDiff ?? 0;
    });

    return Object.values(tableMap);
  }

  private generateChartData(filtered: LeaveRequest[]) {
    const chartMap: Record<string, number> = {};
    filtered.forEach(r => {
      const typeDesc = r.leaveTypeEntity.typeDescription;
      chartMap[typeDesc] = (chartMap[typeDesc] || 0) + (r.dayDiff ?? 0);
    });

    this.chartData = Object.entries(chartMap).map(([type, days]) => ({ type, days }));
    this.barChartLabels = this.chartData.map(c => c.type);
    this.barChartData[0].data = this.chartData.map(c => c.days);
  }

  exportExcel() {
    if (!this.dataSource.data || this.dataSource.data.length === 0) return;

    const wsData = this.dataSource.data.map(item => ({
      'ชื่อ-นามสกุล': item.userName,
      'แผนก': item.department,
      'ลาป่วย': item.Sick,
      'ลาพักร้อน': item.Vacation,
      'ลากิจ': item.Personal,
      'รวม': item.total
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(wsData);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leave History');

    XLSX.writeFile(wb, 'LeaveHistory.xlsx');
  }

}
