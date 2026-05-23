import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  template: `
    <div style="padding-top:80px;background:var(--bg-secondary);min-height:100vh">
      <div class="container" style="padding:64px 0;max-width:800px">
        <h1 style="text-align:center;margin-bottom:48px">Frequently Asked Questions</h1>
        <div style="display:flex;flex-direction:column;gap:16px">
          <div style="background:var(--bg-card);padding:24px;border-radius:var(--radius-md);box-shadow:var(--shadow-card)">
            <h4 style="margin-bottom:8px">How long does customization take?</h4>
            <p style="color:var(--text-secondary);margin:0">Typically, custom orders take 14-21 working days to manufacture and deliver, depending on the complexity of the design.</p>
          </div>
          <div style="background:var(--bg-card);padding:24px;border-radius:var(--radius-md);box-shadow:var(--shadow-card)">
            <h4 style="margin-bottom:8px">What wood types do you offer?</h4>
            <p style="color:var(--text-secondary);margin:0">We primarily use Grade-A Solid Teak, Sheesham (Indian Rosewood), Mango Wood, and Walnut.</p>
          </div>
          <div style="background:var(--bg-card);padding:24px;border-radius:var(--radius-md);box-shadow:var(--shadow-card)">
            <h4 style="margin-bottom:8px">Do you offer a warranty?</h4>
            <p style="color:var(--text-secondary);margin:0">Yes, all our solid wood furniture comes with a comprehensive 5-year warranty covering manufacturing defects and wood borer issues.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FaqComponent {}
