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
import {
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule,
  NbIconModule,
  NbMenuService,
  NbWindowService,
} from "@nebular/theme";
import { obtenerUsuarioId } from "../../../../redux/selectos/usuario.selector";
import { catchError, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { EliminarComponent } from "../eliminar/eliminar.component";
import { ContenedorActionBorrarInformacion, ContenedorActionInit } from "../../../../redux/actions/contenedor.actions";

@Component({
  selector: "app-lista",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NbCardModule,
    NbButtonModule,
    NgOptimizedImage,
    NbContextMenuModule,
    NbEvaIconsModule,
    NbIconModule,
    NbBadgeModule
  ],
  templateUrl: "./lista.component.html",
  styleUrls: ["./lista.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaComponent extends General implements OnInit {
  private contenedorService = inject(ContenedorService);
  private menuService = inject(NbMenuService);
  private windowService = inject(NbWindowService);
  arrContenedores: any[] = [];
  contenedor: any = [];
  dominioApp = ".reddoc.online";
  items = [
    { title: "Invitaciones" },
    { title: "Mi contenedor" },
    { title: "Eliminar" },
  ];

  ngOnInit() {
    this.consultarLista();
    this.menu();
    this.limpiarContenedores()
  }

  limpiarContenedores() {
    this.store.dispatch(ContenedorActionBorrarInformacion())
    this.changeDetectorRef.detectChanges();
  }

  menu() {
    this.menuService.onItemClick().subscribe((evento) => {
      if (evento.item.title == "Invitaciones") {
        this.router.navigateByUrl(
          `/contenedor/${this.contenedor.nombre}/${this.contenedor.contenedor_id}/invitacion/nuevo`
        );
      }
      if (evento.item.title == "Mi contenedor") {
        this.router.navigateByUrl(
          `/contenedor/detalle/${this.contenedor.contenedor_id}`
        );
      }
      if (evento.item.title == "Eliminar") {
        this.eliminarContenedor();
      }
    });
  }

  consultarLista() {
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((respuestaUsuarioId) =>
          this.contenedorService.lista(respuestaUsuarioId)
        ),
        tap((respuestaLista) => {
          this.arrContenedores = respuestaLista.contenedores;
          this.changeDetectorRef.detectChanges();
        }),
        catchError(({ error }) => {
          this.alerta.mensajeError(
            "Error consulta",
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          );
          return of(null);
        })
      )
      .subscribe();
  }

  seleccionarEmpresa(contenedor_id: string) {
    this.contenedorService.detalle(contenedor_id).subscribe(
      (respuesta) => {
        const contenedor: any = {
          nombre: respuesta.nombre,
          imagen:
            'https://es.expensereduction.com/wp-content/uploads/2018/02/logo-placeholder.png',
          contenedor_id: respuesta.id,
          subdominio: respuesta.subdominio,
          id: respuesta.id,
          usuario_id: 1,
          seleccion: true,
          rol: respuesta.rol,
          plan_id: null,
          plan_nombre: null,
          usuarios: 1,
          usuarios_base: 0,
          ciudad: 0,
          correo: '',
          direccion: '',
          identificacion: 0,
          nombre_corto: '',
          numero_identificacion: 0,
          telefono: '',
        };
        this.store.dispatch(ContenedorActionInit({ contenedor }));
        this.router.navigateByUrl("/dashboard");
      }
    )

  }

  eliminarContenedor() {
    this.windowService.open(EliminarComponent, { title: `Eliminar contenedor`, context: this.contenedor });
  }

  onMenuItemClick(contenedor: any) {
    this.contenedor = contenedor;
    this.changeDetectorRef.detectChanges();
  }
}
