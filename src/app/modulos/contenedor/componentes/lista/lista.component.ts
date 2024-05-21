import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { ContenedorService } from "../../servicios/contenedor.service";
import { General } from "../../../../comun/clases/general";
import { RouterModule } from "@angular/router";
import { NbButtonModule, NbCardModule } from "@nebular/theme";
import { obtenerUsuarioId } from "../../../../redux/selectos/usuario.selector";
import { catchError, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-lista",
  standalone: true,
  imports: [CommonModule, RouterModule, NbCardModule, NbButtonModule, NgOptimizedImage],
  templateUrl: "./lista.component.html",
  styleUrls: ["./lista.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaComponent extends General implements OnInit {
  arrContenedores: any[] = [];
  private contenedorService = inject(ContenedorService);

  ngOnInit() {
    this.consultarLista();
  }

  consultarLista() {
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((respuestaUsuarioId) =>
          this.contenedorService.lista(respuestaUsuarioId)
        ),tap(
          (respuestaLista) => {
            this.arrContenedores = respuestaLista.contenedores
            this.changeDetectorRef.detectChanges();
          }
        ),catchError(({error}) => {
          this.alerta.mensajeError(
            'Error consulta',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          )
          return of(null);
        })
      )
      .subscribe();
  }

  seleccionarEmpresa() {
    this.router.navigateByUrl("/dashboard");
  }
}
