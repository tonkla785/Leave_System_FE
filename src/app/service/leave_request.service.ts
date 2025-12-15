import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, LeaveRequest } from '../interface/data_interface';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8080/leave-request';

  getAllReq(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/get-all-req`);
  }

  getStatusPending(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/get-pending-req`);
  }

  getStatusApprove(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/get-approved-req`);
  }

  getStatusReject(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/get-reject-req`);
  }

  createRequest(body: LeaveRequest): Observable<any> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/create-request`,
      body
    );
  }

  updateRequest(id: number, status: string): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (status !== undefined && status !== null) {
      params = params.set('status', status);
    }
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/update-status-req/${id}`,
      {},
      { params }
    );
  }
}
