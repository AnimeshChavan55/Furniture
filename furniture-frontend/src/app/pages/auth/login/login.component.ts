import { Component, signal } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  loading = signal(false);
  showPassword = signal(false);

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit() {
    if (!this.email() || !this.password()) {
      this.toast.error('Please enter email and password.', 'Validation');
      return;
    }

    this.loading.set(true);
    this.authService.login(this.email(), this.password()).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.toast.success(`Welcome back, ${res.data?.user.first_name}!`, 'Login Successful');
        this.cartService.loadCart().subscribe();
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error(err.error?.message || 'Login failed. Please try again.', 'Login Failed');
      }
    });
  }

  demoLogin(type: 'user' | 'admin') {
    const creds = type === 'admin'
      ? { email: 'admin@customcraft.com', password: 'password' }
      : { email: 'rahul@example.com', password: 'password' };
    this.email.set(creds.email);
    this.password.set(creds.password);
  }
}
