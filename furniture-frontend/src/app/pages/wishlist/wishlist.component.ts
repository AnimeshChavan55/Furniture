import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div style="padding-top:80px;background:var(--bg-secondary);min-height:100vh">
      <div class="container" style="padding-top:32px;padding-bottom:64px">
        <h1 style="margin-bottom:28px"><i class="fas fa-heart" style="color:var(--primary)"></i> My Wishlist</h1>
        <div class="empty-state">
          <div class="icon">💔</div>
          <h3>Your wishlist is empty</h3>
          <p>You haven't saved any items yet. Found something you like? Tap the heart icon to save it for later.</p>
          <a routerLink="/products" class="btn btn-primary btn-lg"><i class="fas fa-search"></i> Browse Products</a>
        </div>
      </div>
    </div>
  `
})
export class WishlistComponent {}
