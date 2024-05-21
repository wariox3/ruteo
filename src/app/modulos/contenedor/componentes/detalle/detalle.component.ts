import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>detalle works!</p>`,
  styleUrls: ['./detalle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleComponent { }
