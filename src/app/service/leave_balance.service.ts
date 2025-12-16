import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, PayloadBalance,  } from '../interface/data_interface';

@Injectable({
  providedIn: 'root',
})
export class LeaveBalanceService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8080/leave-balance';

  getBalance(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/get-all-balance`);
  }

  createBalance(body: PayloadBalance): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-balance`, body);
  }
}
