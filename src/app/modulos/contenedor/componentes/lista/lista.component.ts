import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ContenedorService } from '../../servicios/contenedor.service';
import { General } from '../../../../comun/clases/general';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaComponent extends General implements OnInit { 

  arrContenedores: any[] = [];
  private contenedorService = inject(ContenedorService);

  ngOnInit() {
    this.consultarLista();
  }

  consultarLista(){
    this.contenedorService.lista('1').subscribe(
      (resultado: any) => {
        if (resultado) {
          this.arrContenedores = resultado.contenedores; 
          this.changeDetectorRef.detectChanges();
        }
      }
    );
  }

}