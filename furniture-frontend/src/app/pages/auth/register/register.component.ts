import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="brand-logo">🛋️</div>
          <h1>Join CustomCraft</h1>
          <p>Create your account and start designing your dream furniture today</p>
        </div>
        <div class="auth-features">
          <div class="auth-feature"><i class="fas fa-check-circle"></i> Free customization consultation</div>
          <div class="auth-feature"><i class="fas fa-check-circle"></i> Exclusive member discounts</div>
          <div class="auth-feature"><i class="fas fa-check-circle"></i> Order tracking & history</div>
          <div class="auth-feature"><i class="fas fa-check-circle"></i> Priority customer support</div>
        </div>
        <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=60" alt="Furniture" class="auth-img">
      </div>
      <div class="auth-right">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Create Account</h2>
            <p>Join 10,000+ happy customers</p>
          </div>
          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <div class="input-wrap">
                  <i class="fas fa-user input-icon"></i>
                  <input type="text" class="form-control" placeholder="Rahul"
                    [value]="form().first_name" (input)="updateField('first_name', $any($event.target).value)" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <div class="input-wrap">
                  <i class="fas fa-user input-icon"></i>
                  <input type="text" class="form-control" placeholder="Sharma"
                    [value]="form().last_name" (input)="updateField('last_name', $any($event.target).value)" required>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-wrap">
                <i class="fas fa-envelope input-icon"></i>
                <input type="email" class="form-control" placeholder="your@email.com"
                  [value]="form().email" (input)="updateField('email', $any($event.target).value)" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Mobile Number</label>
              <div class="input-wrap">
                <i class="fas fa-phone input-icon"></i>
                <input type="tel" class="form-control" placeholder="+91 98765 43210"
                  [value]="form().phone" (input)="updateField('phone', $any($event.target).value)">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-wrap">
                <i class="fas fa-lock input-icon"></i>
                <input [type]="showPw() ? 'text' : 'password'" class="form-control" placeholder="Min. 8 characters"
                  [value]="form().password" (input)="updateField('password', $any($event.target).value)" required>
                <button type="button" class="toggle-pass" (click)="showPw.set(!showPw())">
                  <i class="fas" [class.fa-eye]="!showPw()" [class.fa-eye-slash]="showPw()"></i>
                </button>
              </div>
            </div>
            <div class="terms-check">
              <input type="checkbox" id="terms" [(ngModel)]="agreedToTerms" name="terms">
              <label for="terms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
            </div>
            <button type="submit" class="btn btn-primary btn-full btn-lg" [disabled]="loading() || !agreedToTerms">
              @if (loading()) { <i class="fas fa-spinner fa-spin"></i> Creating Account... }
              @else { <i class="fas fa-user-plus"></i> Create Account }
            </button>
          </form>
          <p class="auth-switch">Already have an account? <a routerLink="/auth/login">Sign In</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('../login/login.component.css');
    .terms-check { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px; font-size: 0.875rem; color: var(--text-muted); }
    .terms-check a { color: var(--primary); }
    .terms-check input { margin-top: 2px; }
    .auth-page { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; padding-top: 80px; }
    .auth-left { background: linear-gradient(135deg, #1A0F06, #3D2B1A, #1A0F06); padding: 60px 48px; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden; }
    .auth-left::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 50%, rgba(139,94,60,0.2), transparent 70%); }
    .auth-brand { position: relative; z-index: 1; margin-bottom: 32px; }
    .brand-logo { font-size: 3rem; margin-bottom: 12px; }
    .auth-brand h1 { font-size: 2rem; color: white; font-family: var(--font-heading); margin-bottom: 8px; }
    .auth-brand p { color: rgba(255,255,255,0.7); }
    .auth-features { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
    .auth-feature { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.85); font-size: 0.875rem; }
    .auth-feature i { color: #2D8A5A; }
    .auth-img { position: absolute; bottom: 0; right: 0; width: 60%; opacity: 0.1; }
    .auth-right { display: flex; align-items: center; justify-content: center; padding: 40px; background: var(--bg-secondary); }
    .auth-card { background: white; border-radius: 24px; padding: 40px; width: 100%; max-width: 460px; box-shadow: 0 8px 40px rgba(0,0,0,0.08); }
    .auth-header { text-align: center; margin-bottom: 28px; }
    .auth-header h2 { font-size: 1.75rem; margin-bottom: 6px; }
    .auth-header p { color: var(--text-muted); }
    .input-wrap { position: relative; }
    .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.875rem; }
    .input-wrap .form-control { padding-left: 42px; }
    .toggle-pass { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; }
    .auth-switch { text-align: center; margin-top: 20px; font-size: 0.9rem; color: var(--text-muted); }
    .auth-switch a { color: var(--primary); font-weight: 600; }
    @media(max-width:768px) { .auth-page { grid-template-columns: 1fr; } .auth-left { display: none; } }
  `]
})
export class RegisterComponent {
  form = signal({ first_name: '', last_name: '', email: '', phone: '', password: '' });
  loading = signal(false);
  showPw = signal(false);
  agreedToTerms = false;

  constructor(private authService: AuthService, private toast: ToastService, private router: Router) {}

  updateField(field: string, value: string) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  onSubmit() {
    const f = this.form();
    if (!f.first_name || !f.last_name || !f.email || !f.password) {
      this.toast.error('Please fill all required fields.'); return;
    }
    if (f.password.length < 8) {
      this.toast.error('Password must be at least 8 characters.'); return;
    }
    this.loading.set(true);
    this.authService.register(f).subscribe({
      next: res => {
        this.loading.set(false);
        this.toast.success('Account created! Welcome to CustomCraft 🎉', 'Registration Successful');
        this.router.navigate(['/']);
      },
      error: err => {
        this.loading.set(false);
        this.toast.error(err.error?.message || 'Registration failed.', 'Error');
      }
    });
  }
}
