import {
  Contenedor,
  ContenedorDetalle,
  ListaContenedoresRespuesta,
} from "@/interfaces/contenedor/contenedor.interface";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import {
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule,
  NbIconModule,
  NbMenuService,
  NbWindowRef,
  NbWindowService,
} from "@nebular/theme";
import { of } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { General } from "../../../../comun/clases/general";
import {
  ContenedorActionBorrarInformacion,
  ContenedorActionInit,
} from "../../../../redux/actions/contenedor.actions";
import { obtenerUsuarioId } from "../../../../redux/selectos/usuario.selector";
import { ContenedorService } from "../../servicios/contenedor.service";
import { EliminarComponent } from "../eliminar/eliminar.component";
import { AnimationFadeinUpDirective } from "@/comun/directivas/animation-fade-in-up.directive";
import { environment } from "environments/environment";

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
    NbBadgeModule,
    AnimationFadeinUpDirective,
    EliminarComponent
  ],
  templateUrl: "./lista.component.html",
  styleUrls: ["./lista.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaComponent extends General implements OnInit {
  @ViewChild('contentTemplate') contentTemplate: TemplateRef<any>;
  private contenedorService = inject(ContenedorService);
  private menuService = inject(NbMenuService);
  private windowService = inject(NbWindowService);
  windowRef: NbWindowRef
  arrConectando: boolean[] = [];
  arrContenedores: any[] = [];
  contenedor: any = [];
  dominioApp = environment.dominioApp
  items = [
    { title: "Invitaciones" },
    { title: "Mi contenedor" },
    { title: "Eliminar" },
  ];

  ngOnInit() {
    this.consultarLista();
    this.menu();
    this.limpiarContenedores();
  }

  limpiarContenedores() {
    this.store.dispatch(ContenedorActionBorrarInformacion());
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
        switchMap((respuestaUsuarioId: string) =>
          this.contenedorService.lista(respuestaUsuarioId)
        ),
        tap((respuestaLista: ListaContenedoresRespuesta) => {
          respuestaLista.contenedores.forEach(() =>
            this.arrConectando.push(false)
          );
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

  seleccionarEmpresa(contenedor_id: string, indexContenedor: number) {
    this.arrConectando[indexContenedor] = true;
    this.contenedorService
      .detalle(contenedor_id)
      .pipe(
        catchError(() => {
          this.arrConectando[indexContenedor] = false;
          return of(null);
        })
      )
      .subscribe((respuesta: ContenedorDetalle) => {
        const contenedor: Contenedor = {
          nombre: respuesta.nombre,
          imagen: respuesta.imagen,
          contenedor_id: respuesta.id,
          subdominio: respuesta.subdominio,
          id: respuesta.id,
          usuario_id: respuesta.usuario_id,
          seleccion: true,
          rol: "",
          plan_id: respuesta.plan_id,
          plan_nombre: respuesta.plan_nombre,
          usuarios: respuesta.plan_limite_usuarios,
          usuarios_base: respuesta.plan_usuarios_base,
          reddoc: respuesta.reddoc,
          ruteo: respuesta.ruteo,
          acceso_restringido: respuesta.acceso_restringido,
        };
        this.store.dispatch(ContenedorActionInit({ contenedor }));
        this.arrConectando[indexContenedor] = false;
        this.router.navigateByUrl("/dashboard");
      });
  }

  eliminarContenedor() {
    this.windowRef = this.windowService.open(this.contentTemplate, {
      title: `Eliminar contenedor`,
      context: {
        contenedor: this.contenedor,
      },
    });
  }

  recibirEliminarContenedor() {
    this.consultarLista();
    this.windowRef.close()
  }

  cerrar() {
    this.windowRef.close()
  }

  onMenuItemClick(contenedor: any) {
    this.contenedor = contenedor;
    this.changeDetectorRef.detectChanges();
  }
}
