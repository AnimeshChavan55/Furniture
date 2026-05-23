import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div style="padding-top:80px;background:var(--bg-secondary);min-height:100vh">
      <div class="container" style="padding-top:32px;padding-bottom:64px;max-width:900px">
        <h1 style="margin-bottom:28px"><i class="fas fa-user" style="color:var(--primary)"></i> My Profile</h1>
        <div class="profile-layout">
          <!-- Left -->
          <div class="profile-card">
            <div class="profile-avatar">{{ auth.currentUser()?.first_name?.charAt(0) }}</div>
            <h3>{{ auth.currentUser()?.first_name }} {{ auth.currentUser()?.last_name }}</h3>
            <p>{{ auth.currentUser()?.email }}</p>
            <span class="role-badge" [class.admin]="auth.isAdmin()">{{ auth.isAdmin() ? '👑 Admin' : '👤 Customer' }}</span>
          </div>

          <!-- Right: Edit Form -->
          <div class="edit-section">
            <div class="section-card">
              <h3>Personal Information</h3>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-control" [(ngModel)]="formData.first_name" name="first_name">
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-control" [(ngModel)]="formData.last_name" name="last_name">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-control" [(ngModel)]="formData.email" name="email">
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-control" [(ngModel)]="formData.phone" name="phone">
              </div>
              <button class="btn btn-primary" (click)="updateProfile()">
                <i class="fas fa-save"></i> Save Changes
              </button>
            </div>

            <div class="section-card">
              <h3>Change Password</h3>
              <div class="form-group">
                <label class="form-label">Current Password</label>
                <input type="password" class="form-control" [(ngModel)]="pwForm.current" name="current_pw">
              </div>
              <div class="form-group">
                <label class="form-label">New Password</label>
                <input type="password" class="form-control" [(ngModel)]="pwForm.new" name="new_pw">
              </div>
              <button class="btn btn-secondary" (click)="changePassword()">
                <i class="fas fa-lock"></i> Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-layout { display: grid; grid-template-columns: 240px 1fr; gap: 28px; align-items: start; }
    .profile-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: 32px 24px; text-align: center; border: 1px solid var(--border-color); box-shadow: var(--shadow-card); }
    .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: var(--primary-gradient); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; margin: 0 auto 16px; }
    .profile-card h3 { font-size: 1.125rem; margin-bottom: 4px; }
    .profile-card p { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 12px; }
    .role-badge { display: inline-block; padding: 4px 14px; border-radius: var(--radius-full); font-size: 0.8125rem; font-weight: 600; background: rgba(139,94,60,0.1); color: var(--primary); }
    .role-badge.admin { background: rgba(212,168,83,0.15); color: var(--accent-dark); }
    .edit-section { display: flex; flex-direction: column; gap: 20px; }
    .section-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: 28px; border: 1px solid var(--border-color); box-shadow: var(--shadow-card); }
    .section-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--border-color); }
    @media(max-width:768px) { .profile-layout { grid-template-columns: 1fr; } }
  `]
})
export class ProfileComponent implements OnInit {
  formData = { first_name: '', last_name: '', email: '', phone: '' };
  pwForm = { current: '', new: '' };

  constructor(public auth: AuthService, private userService: UserService, private toast: ToastService) {}

  ngOnInit() {
    const u = this.auth.currentUser();
    if (u) this.formData = { first_name: u.first_name, last_name: u.last_name, email: u.email, phone: u.phone || '' };
  }

  updateProfile() {
    this.userService.updateProfile(this.formData).subscribe({
      next: res => { if (res.success) { this.auth.updateCurrentUser({ ...this.auth.currentUser()!, ...this.formData }); this.toast.success('Profile updated successfully!'); } },
      error: () => this.toast.error('Failed to update profile')
    });
  }

  changePassword() {
    this.toast.info('Password change functionality will be available soon.');
  }
}
