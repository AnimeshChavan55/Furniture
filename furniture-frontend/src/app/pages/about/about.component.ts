import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="padding-top:80px">
      <div style="background:var(--primary-gradient);padding:80px 0;text-align:center;color:white">
        <div class="container">
          <h1 style="font-size:2.5rem;margin-bottom:16px">About CustomCraft</h1>
          <p style="font-size:1.125rem;opacity:0.8;max-width:600px;margin:0 auto">Crafting timeless furniture tailored exactly to your vision, right here in India.</p>
        </div>
      </div>
      <div class="container" style="padding:64px 0">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center">
          <div>
            <h2 style="font-size:2rem;color:var(--text-primary);margin-bottom:24px">Our Story</h2>
            <p style="color:var(--text-secondary);line-height:1.8;margin-bottom:16px">Founded in 2010, CustomCraft began with a simple mission: to make premium, customized solid wood furniture accessible to everyone. We believe your home should reflect your unique personality.</p>
            <p style="color:var(--text-secondary);line-height:1.8">By eliminating middlemen and working directly with expert artisans in Rajasthan, we offer unparalleled craftsmanship without the inflated showroom prices.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" style="width:100%;border-radius:24px;box-shadow:var(--shadow-card)">
        </div>
      </div>
    </div>
  `
})
export class AboutComponent {}
