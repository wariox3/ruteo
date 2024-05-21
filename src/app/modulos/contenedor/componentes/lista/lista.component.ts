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
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule,
  NbIconModule,
  NbMenuService,
} from "@nebular/theme";
import { obtenerUsuarioId } from "../../../../redux/selectos/usuario.selector";
import { catchError, filter, map, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { NbEvaIconsModule } from "@nebular/eva-icons";

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
  ],
  templateUrl: "./lista.component.html",
  styleUrls: ["./lista.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaComponent extends General implements OnInit {
  arrContenedores: any[] = [];
  private contenedorService = inject(ContenedorService);
  private menuService= inject(NbMenuService);
  
  items = [{ title: 'Invitaciones' }, { title: 'Mi contenedor' }, { title: 'Eliminar' }];
  contenedor: any = [];
  dominioApp = '.reddoc.online'

  ngOnInit() {
    this.consultarLista();
    this.menu();
  }

  menu(){
    this.menuService.onItemClick().subscribe((evento) => {
      if (evento.item.title == "Eliminar") {
        this.eliminarContenedor();
      }
      if (evento.item.title == "Mi contenedor") {
        this.router.navigateByUrl(`/contenedor/detalle/${this.contenedor.contenedor_id}`)
      }
      if (evento.item.title == "Invitaciones") {
        this.router.navigateByUrl(`/contenedor/${this.contenedor.nombre}/${this.contenedor.contenedor_id}/invitacion/nuevo`)
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

  seleccionarEmpresa() {
    this.router.navigateByUrl("/dashboard");
  }

  eliminarContenedor(){
 
  }

  onMenuItemClick(contenedor:any){
    this.contenedor = contenedor
    this.changeDetectorRef.detectChanges();
  }
}
