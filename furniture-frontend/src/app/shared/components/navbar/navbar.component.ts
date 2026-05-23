import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  userDropdownOpen = signal(false);
  isDark = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 60);
  }

  toggleMobileMenu() { this.mobileMenuOpen.update(v => !v); }
  toggleUserDropdown() { this.userDropdownOpen.update(v => !v); }
  closeMobileMenu() { this.mobileMenuOpen.set(false); }

  toggleDarkMode() {
    this.isDark.update(v => !v);
    document.documentElement.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
  }

  logout() {
    this.authService.logout();
    this.userDropdownOpen.set(false);
  }
}
