import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ContenedorService } from '../../servicios/contenedor.service';
import { General } from '../../../../comun/clases/general';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
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

  seleccionarEmpresa(){
    this.router.navigateByUrl('/dashboard')
  }

}
