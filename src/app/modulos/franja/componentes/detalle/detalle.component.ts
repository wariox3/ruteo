import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { franjaService } from '../../servicios/vehiculo.service';
import { switchMap, tap } from 'rxjs/operators';
import { General } from '../../../../comun/clases/general';
import { GoogleMapsModule, MapInfoWindow,  } from "@angular/google-maps";

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    RouterModule,
    NbIconModule,
    NbButtonModule,
    GoogleMapsModule
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleComponent extends General implements OnInit {

  protected activatedRoute = inject(ActivatedRoute);
  protected franjaService = inject(franjaService);

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  center: google.maps.LatLngLiteral = { lat: 6.200713725811437, lng: -75.58609508555918 };
  zoom = 11;
  markerPositions: google.maps.LatLngLiteral[] = [];
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 3,
  };
  directionsResults: google.maps.DirectionsResult | undefined;

  vertices: google.maps.LatLngLiteral[] = [  ];


  franja: any = {
    nombre: '',
    coordenadas: {

    }
  }

ngOnInit(): void {
  this.activatedRoute.params.pipe(
    switchMap((respuestaParametros: any)=> {
      return this.franjaService.consultarDetalle(respuestaParametros.id)
    }),
    tap((respuestaConsultaDetalle)=>{
      this.franja = respuestaConsultaDetalle
      this.changeDetectorRef.detectChanges();
    })
  ).subscribe();
}

}
