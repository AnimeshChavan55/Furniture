import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private toast: ToastService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.toast.error('Session expired. Please login again.', 'Authentication');
          this.router.navigate(['/auth/login']);
        } else if (error.status === 403) {
          this.toast.error('Access denied. You do not have permission.', 'Forbidden');
          this.router.navigate(['/']);
        } else if (error.status === 0) {
          this.toast.error('Unable to connect to server. Please try again.', 'Connection Error');
        }
        return throwError(() => error);
      })
    );
  }
}
