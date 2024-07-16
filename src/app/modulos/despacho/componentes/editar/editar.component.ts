import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { NbCardModule } from "@nebular/theme";
import { FormularioComponent } from "../formulario/formulario.component";
import { General } from "../../../../comun/clases/general";
import { GuiaService } from "../../servicios/despacho.service";
import { switchMap, tap } from "rxjs/operators";

@Component({
  selector: "app-editar",
  standalone: true,
  imports: [CommonModule, NbCardModule, FormularioComponent],
  templateUrl: "./editar.component.html",
  styleUrls: ["./editar.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditarComponent extends General implements OnInit {
  private guiaService = inject(GuiaService);
  informacionGuia: any = {

  };


  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap((respuestaParametros: any)=> {
        return this.guiaService.consultarDetalle(respuestaParametros.id)
      }),
      tap((respuestaConsultaDetalle)=>{
        this.informacionGuia = respuestaConsultaDetalle
        this.changeDetectorRef.detectChanges();
      })
    ).subscribe();
  }


  enviarFormulario(formulario: any) {
    this.guiaService.guardarGuias(formulario).subscribe((respuesta: any) => {
      this.alerta.mensajaExitoso('Se ha actualizado la guía exitosamente.', 'Guardado con éxito.')
      this.router.navigate(['/guia/movimiento/detalle', respuesta.id]);
    });
  }
}
