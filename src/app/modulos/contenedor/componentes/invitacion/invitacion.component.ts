import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-invitacion',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>invitacion works!</p>`,
  styleUrls: ['./invitacion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitacionComponent { }
