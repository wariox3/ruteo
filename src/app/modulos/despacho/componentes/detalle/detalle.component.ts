import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { NbButtonModule, NbCardModule, NbIconModule } from "@nebular/theme";
import { DespachoService } from "../../servicios/despacho.service";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { General } from "../../../../comun/clases/general";
import { forkJoin, of } from "rxjs";
import { GuiaService } from "../../../guia/servicios/guia.service";

@Component({
  selector: "app-detalle",
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    RouterModule,
    NbIconModule,
    NbButtonModule,
  ],
  templateUrl: "./detalle.component.html",
  styleUrls: ["./detalle.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleComponent extends General implements OnInit {
  protected activatedRoute = inject(ActivatedRoute);
  protected despachoService = inject(DespachoService);
  protected visitaService = inject(GuiaService);

  despacho = {
    id: null,
    vehiculo_id: null,
    peso: null,
    volumen: null,
    visitas: null,
  };

  arrVisitas: any[];

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((respuestaParametros: any) => {
          return this.despachoService
            .consultarDetalle(respuestaParametros.id)
            .pipe(
              tap((respuestaConsultaDetalle) => {
                this.despacho = respuestaConsultaDetalle;
                this.changeDetectorRef.detectChanges();
              }),
              switchMap((respuestaConsultaDetalle) => {
                const arrParametrosConsulta = {
                  filtros: [
                    {
                      propiedad: "despacho_id",
                      valor1: respuestaConsultaDetalle.id,
                    },
                  ],
                  ordenamientos: [
                    "orden"
                  ]
                };
                return this.visitaService.listarVisitas(arrParametrosConsulta);
              })
            );
        }),
        tap((respuestaOtraConsulta) => {
          this.arrVisitas = respuestaOtraConsulta;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  // ngOnInit(): void {
  //   this.activatedRoute.params.pipe(
  //     switchMap((respuestaParametros: any) => {
  //       return this.despachoService.consultarDetalle(respuestaParametros.id).pipe(
  //         map(detalle => {
  //           const arrParametrosConsulta = {
  //             filtros: [{
  //               propiedad: 'despacho_id',
  //               valor1: respuestaParametros.id
  //             }],
  //           };
  //           return { detalle, arrParametrosConsulta };
  //         }),
  //         switchMap(({ detalle, arrParametrosConsulta }) => {
  //           return forkJoin({
  //             detalle: of(detalle),
  //             visita: this.visitaService.listarVisitas(arrParametrosConsulta)
  //           }).pipe(
  //             map(({ detalle, visita }) => ({ detalle, visita })),
  //             catchError(error => {
  //               console.error('Error en la segunda petición:', error);
  //               // Manejo de error para la segunda petición
  //               return of({ detalle, visita: null });
  //             })
  //           );
  //         }),
  //         catchError(error => {
  //           console.error('Error en la primera petición:', error);
  //           // Manejo de error para la primera petición
  //           return of({ detalle: null, visita: null });
  //         })
  //       );
  //     }),
  //     tap(({ detalle, visita }) => {
  //       if (detalle) {
  //         this.despacho = detalle;
  //       }
  //       if (visita) {
  //         this.visita = visita;
  //       }
  //       this.changeDetectorRef.detectChanges();
  //     })
  //   ).subscribe();
  // }
}
