import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbMenuModule,
  NbSelectModule,
  NbWindowModule,
  NbWindowRef,
  NbWindowService,
} from "@nebular/theme";
import { BaseFiltroComponent } from "../../../../comun/componentes/base-filtro/base-filtro.component";
import { General } from "../../../../comun/clases/general";
import { GuiaService } from "../../servicios/guia.service";
import { mapeo } from "../../servicios/mapeo";
import {
  GoogleMapsModule,
  MapInfoWindow,
  MapMarker,
  MapDirectionsService,
  MapDirectionsRenderer,
} from "@angular/google-maps";
import { FormControl, FormGroup, FormsModule } from "@angular/forms";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-lista",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NbCardModule,
    BaseFiltroComponent,
    NbButtonModule,
    NbIconModule,
    NbDialogModule,
    NbWindowModule,
    GoogleMapsModule,
    NbSelectModule,
    FormsModule,
    NbInputModule,
    NbContextMenuModule,
  ],
  templateUrl: "./lista.component.html",
  styleUrls: ["./lista.component.scss"],
})
export class ListaComponent extends General implements OnInit {
  @ViewChild("contentTemplate") contentTemplate: TemplateRef<any>;
  @ViewChild("contentTemplateComplemento")
  contentTemplateComplemento: TemplateRef<any>;
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  private windowRef: NbWindowRef | null = null;

  constructor(
    private windowService: NbWindowService,
    private guiaService: GuiaService,
    private directionsService: MapDirectionsService
  ) {
    super();
  }

  numeroDeRegistrosAImportar: number = 1;
  estaImportandoComplementos: boolean = false;
  items = [{ title: "Por excel" }, { title: "Por complemento" }];
  formularioComplementos: FormGroup;
  metodoSeleccionado: string;
  selectedFile: File | null = null;
  base64File: string | null = null;
  fileName: string = "";
  arrParametrosConsulta: any = {
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: "RutVisita",
  };
  cantidad_registros!: number;
  arrGuia: any[];
  arrGuiasOrdenadas: any[];
  encabezados: any[];

  center: google.maps.LatLngLiteral = {
    lat: 6.200713725811437,
    lng: -75.58609508555918,
  };
  zoom = 8;
  markerPositions: google.maps.LatLngLiteral[] = [];
  marcarPosicionesVisitasOrdenadas: google.maps.LatLngLiteral[] = [
    { lat: 6.200713725811437, lng: -75.58609508555918 },
  ];
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 3,
  };
  directionsResults: google.maps.DirectionsResult | undefined;

  ngOnInit() {
    this.consultaLista();
    this.inicializarFormulario();
    this.encabezados = mapeo.datos.filter(
      (titulo) => titulo.visibleTabla === true
    );
  }

  inicializarFormulario() {
    this.formularioComplementos = new FormGroup({
      registros: new FormControl(1),
    });
    this.changeDetectorRef.detectChanges();
  }

  consultaLista() {
    this.guiaService
      .lista(this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        this.arrGuia = respuesta;
        respuesta.forEach((punto) => {
          this.addMarker({ lat: punto.latitud, lng: punto.longitud });
        });
        this.changeDetectorRef.detectChanges();
      });
    if (this.arrGuiasOrdenadas?.length >= 1) {
      this.arrGuiasOrdenadas.forEach((punto) => {
        this.addMarkerOrdenadas({ lat: punto.latitud, lng: punto.longitud });
      });
      this.calculateRoute();
      this.changeDetectorRef.detectChanges();
    }
  }

  decodificar() {
    this.guiaService.decodificar().subscribe(() => {
      this.consultaLista();
      this.alerta.mensajaExitoso(
        "Se ha decodificado correctamente",
        "Guardado con éxito."
      );
    });
  }

  ordenar() {
    this.guiaService.ordenar().subscribe((respuesta: any) => {
      this.arrGuiasOrdenadas = respuesta.visitas_ordenadas;
      this.consultaLista();
      this.alerta.mensajaExitoso(
        "Se ha ordenado correctamente",
        "Guardado con éxito."
      );
    });
  }

  importarComplemento() {
    this.estaImportandoComplementos = true;
    this.guiaService
      .importarComplementos(
        this.transformarAPositivoMayorCero(this.numeroDeRegistrosAImportar)
      )
      .pipe(
        finalize(() => {
          this.estaImportandoComplementos = false;
          this.numeroDeRegistrosAImportar = 1;
        })
      )
      .subscribe((respuesta: { mensaje: string }) => {
        this.consultaLista();
        this.alerta.mensajaExitoso(
          respuesta?.mensaje || "Se han importado las visitas con éxito",
          "Importado con éxito."
        );
        if (this.windowRef) {
          this.windowRef.close();
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  detalleGuia(guia_id: Number) {
    this.router.navigate([`visita/movimiento/detalle/`, guia_id]);
  }

  editarGuia(guia_id: Number) {
    this.router.navigate([`visita/movimiento/editar/`, guia_id]);
  }

  openWindow() {
    switch (this.metodoSeleccionado) {
      case "0":
        this.windowRef = this.windowService.open(this.contentTemplate, {
          title: "Importar excel",
        });
        break;
      case "1":
        this.windowRef = this.windowService.open(
          this.contentTemplateComplemento,
          {
            title: "Importar complemento",
          }
        );
        break;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.selectedFile = file;
      this.convertToBase64(file);
    }
  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      this.base64File = result.split(",")[1];
    };
    reader.onerror = (error) => {
      console.error("Error: ", error);
    };
  }

  uploadFile() {
    if (this.base64File) {
      this.guiaService
        .importarVisitas({ archivo_base64: this.base64File })
        .subscribe((response) => {
          this.consultaLista();
          this.alerta.mensajaExitoso(
            "Se han cargado las guias con éxito",
            "Guardado con éxito."
          );
          this.resetFileInput();
          if (this.windowRef) {
            this.windowRef.close();
          }
        });
    } else {
      this.alerta.mensajeError("No se ha seleccionado ningún archivo", "Error");
    }
  }

  resetFileInput() {
    this.fileInput.nativeElement.value = "";
    this.fileName = "";
    this.base64File = "";
    this.changeDetectorRef.detectChanges();
  }

  addMarker(position: google.maps.LatLngLiteral) {
    this.markerPositions.push(position);
  }

  addMarkerOrdenadas(position: google.maps.LatLngLiteral) {
    this.marcarPosicionesVisitasOrdenadas.push(position);
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  transformarAPositivoMayorCero(numero: number) {
    return numero > 0 ? numero : 1;
  }

  calculateRoute() {
    if (this.marcarPosicionesVisitasOrdenadas.length < 2) {
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
      optimizeWaypoints: false, // Cambia a true si quieres optimizar el orden de las paradas
    };

    this.directionsService.route(request).subscribe({
      next: (response) => {
        this.directionsResults = response.result;
        this.changeDetectorRef.detectChanges();
      },
      error: (e) => console.error(e),
    });
  }
}
