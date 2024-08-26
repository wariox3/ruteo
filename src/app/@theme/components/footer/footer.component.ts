import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <div class="text-dark order-2 order-md-1">
    <span class="text-muted fw-semibold me-1">{{currentDateStr}}&copy;</span>
    <a href="http://www.semantica.com.co/rubidio/public/index.php" target="_blank" class="text-gray-800 text-hover-primary"> Semantica Digital SAS</a>
  </div>
  `,
})
export class FooterComponent {
  currentDateStr: string = new Date().getFullYear().toString();
}
