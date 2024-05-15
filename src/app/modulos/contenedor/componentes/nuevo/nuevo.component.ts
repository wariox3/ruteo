import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>nuevo works!</p>`,
  styleUrls: ['./nuevo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevoComponent { }
