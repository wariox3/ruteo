import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbListModule,
} from "@nebular/theme";
import { General } from "../../../../comun/clases/general";
import { GoogleMapsModule, MapDirectionsService } from "@angular/google-maps";
import { DespachoService } from "../../../despacho/servicios/despacho.service";
import { GuiaService } from "../../../guia/servicios/guia.service";

@Component({
  selector: "app-trafico",
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbListModule,
    GoogleMapsModule,
  ],
  templateUrl: "./trafico.component.html",
  styleUrls: ["./trafico.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraficoComponent extends General implements OnInit {
  constructor(
    private despachoService: DespachoService,
    private visitaService: GuiaService,
    private directionsService: MapDirectionsService
  ) {
    super();
  }

  
  despachoSeleccionado: any = null;
  mostrarMapaFlag: boolean = false;
  center: google.maps.LatLngLiteral = {
    lat: 6.200713725811437,
    lng: -75.58609508555918,
  };
  zoom = 8;
  marcarPosicionesVisitasOrdenadas: google.maps.LatLngLiteral[] = [];
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 3,
  };
  directionsResults: google.maps.DirectionsResult | undefined;

  arrParametrosConsulta: any = {
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: "RutDespacho",
  };

  arrDespachos: any = [];
  arrVisitasPorDespacho: any = [];

  ngOnInit(): void {
    this.consultaLista();
  }

  consultaLista() {
    this.despachoService.lista(this.arrParametrosConsulta).subscribe((respuesta) => {
      this.arrDespachos = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

  seleccionarDespacho(despacho: any) {
    this.despachoSeleccionado = despacho;
    this.mostrarMapaFlag = false; // Cerrar el mapa
    this.marcarPosicionesVisitasOrdenadas = [];
    this.directionsResults = undefined; // Limpiar los resultados de las direcciones
    this.changeDetectorRef.detectChanges();

    const parametrosConsultaVisitas = {
      filtros: [{ propiedad: "despacho_id", valor1: despacho.id }],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: "RutVisita",
    };
    this.visitaService.listarVisitas(parametrosConsultaVisitas).subscribe((respuesta) => {
      this.arrVisitasPorDespacho = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

  addMarker(position: google.maps.LatLngLiteral) {
    this.marcarPosicionesVisitasOrdenadas.push(position);
  }

  mostrarMapa(despachoSeleccionado: number) {
    if (despachoSeleccionado) {
      this.marcarPosicionesVisitasOrdenadas = [{ lat: 6.200713725811437, lng: -75.58609508555918 }];
      this.arrVisitasPorDespacho.forEach((punto) => {
        this.addMarker({ lat: punto.latitud, lng: punto.longitud });
      });

      if (this.marcarPosicionesVisitasOrdenadas.length < 1) {
        console.error("Se necesitan al menos dos puntos para calcular la ruta.");
        return;
      }

      const origin = this.marcarPosicionesVisitasOrdenadas[0];
      const destination =
        this.marcarPosicionesVisitasOrdenadas[
          this.marcarPosicionesVisitasOrdenadas.length - 1
        ];

      const waypoints = this.marcarPosicionesVisitasOrdenadas
        .slice(1, -1)
        .map((position) => ({
          location: new google.maps.LatLng(position.lat, position.lng),
          stopover: true,
        }));

      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      };

      this.directionsService.route(request).subscribe({
        next: (response) => {
          this.directionsResults = response.result;
          this.changeDetectorRef.detectChanges();
        },
        error: (e) => console.error(e),
      });
      this.mostrarMapaFlag = true;
      this.changeDetectorRef.detectChanges();
    } else {
      this.alerta.mensajeError("No se ha seleccionado ningún despacho", "Error");
    }
  }
  
}
