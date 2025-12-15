import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../interface/data_interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8080/leave-type';

  getType(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/get-type`);
  }
}
