import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/profile`);
  }

  updateProfile(data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/profile`, data);
  }

  addAddress(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/addresses`, data);
  }

  deleteAddress(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/addresses/${id}`);
  }

  getNotifications(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/notifications`);
  }
}
