import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { General } from "../../../../comun/clases/general";
import { FormularioComponent } from "../formulario/formulario.component";
import { NbCardModule } from "@nebular/theme";
import { ContenedorService } from "../../servicios/contenedor.service";
import { of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { obtenerUsuarioId } from "../../../../redux/selectos/usuario.selector";

@Component({
  selector: "app-nuevo",
  standalone: true,
  imports: [CommonModule, FormularioComponent, NbCardModule],
  templateUrl: "./nuevo.component.html",
  styleUrls: ["./nuevo.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevoComponent extends General implements OnInit {
  private contenedorService = inject(ContenedorService);
  procesando = false;
  codigoUsuario = '';

  informacionContenedor: any = {
    nombre: "",
    subdominio: "",
    plan_id: 0,
    imagen: null,
    ciudad: "",
    correo: "",
    direccion: "",
    identificacion: "",
    nombre_corto: "",
    numero_identificacion: "",
    telefono: "",
    ciudad_nombre: "",
    digito_verificacion: "",
  };

  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
    });
  }

  enviarFormulario(formulario: any) {
    this.contenedorService
      .consultarNombre(formulario.subdominio)
      .pipe(
        switchMap(({ validar }) => {
          if (validar) {
            return this.contenedorService.nuevo(formulario, this.codigoUsuario);
          }
          return of(null);
        }),
        tap((respuestaNuevo) => {
          if(respuestaNuevo.contenedor){
            this.alerta.mensajaExitoso('Se ha creado el contenedor exitosamente.', 'Guardado con éxito.')
            this.router.navigate(['/contenedor/lista']);
          }
        })
      )
      .subscribe();
  }
}
