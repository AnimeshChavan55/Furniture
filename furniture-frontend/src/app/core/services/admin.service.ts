import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/dashboard`);
  }

  getUsers(params: any = {}): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/users`, { params });
  }

  updateUserStatus(id: number, is_active: boolean): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/users/${id}/status`, { is_active });
  }

  getInventory(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/inventory`);
  }

  updateInventory(productId: number, data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/inventory/${productId}`, data);
  }

  getSalesReport(params: any = {}): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/reports/sales`, { params });
  }

  getContacts(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/contacts`);
  }

  createCategory(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/categories`, data);
  }

  updateCategory(id: number, data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/categories/${id}`, data);
  }
}
