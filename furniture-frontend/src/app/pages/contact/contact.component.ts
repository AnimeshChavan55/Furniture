import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding-top:80px;background:var(--bg-secondary);min-height:100vh">
      <div class="container" style="padding:64px 0">
        <div style="text-align:center;margin-bottom:48px">
          <h1>Contact Us</h1>
          <p style="color:var(--text-muted)">We'd love to hear from you. Reach out for customizations or support.</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px">
          <div style="background:var(--bg-card);padding:40px;border-radius:var(--radius-lg);box-shadow:var(--shadow-card)">
            <h3>Send a Message</h3>
            <div style="margin-top:24px;display:flex;flex-direction:column;gap:16px">
              <div><label class="form-label">Name</label><input type="text" class="form-control" placeholder="Your Name"></div>
              <div><label class="form-label">Email</label><input type="email" class="form-control" placeholder="your@email.com"></div>
              <div><label class="form-label">Message</label><textarea class="form-control" rows="5" placeholder="How can we help?"></textarea></div>
              <button class="btn btn-primary btn-lg">Send Message</button>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:24px">
            <div style="background:var(--bg-card);padding:32px;border-radius:var(--radius-lg);box-shadow:var(--shadow-card)">
              <h3 style="margin-bottom:16px"><i class="fas fa-map-marker-alt" style="color:var(--primary)"></i> Our Workshop</h3>
              <p style="color:var(--text-secondary)">42, Furniture Lane, Industrial Area,<br>Jaipur, Rajasthan 302001<br>India</p>
            </div>
            <div style="background:var(--bg-card);padding:32px;border-radius:var(--radius-lg);box-shadow:var(--shadow-card)">
              <h3 style="margin-bottom:16px"><i class="fas fa-phone" style="color:var(--primary)"></i> Contact Details</h3>
              <p style="color:var(--text-secondary)"><strong>Phone:</strong> +91 98765 43210<br><strong>Email:</strong> support&#64;customcraft.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent {}
