import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { BaseFiltroComponent } from '../../../../comun/componentes/base-filtro/base-filtro.component';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    BaseFiltroComponent
  ],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaComponent { }
