import { ParametrosConsulta } from "@/interfaces/general/general.interface";
import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import {
  GoogleMapsModule,
  MapDirectionsService,
  MapInfoWindow,
  MapMarker,
} from "@angular/google-maps";
import { RouterModule } from "@angular/router";
import {
  NbButtonGroupModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbMenuService,
  NbSelectModule,
  NbWindowModule,
  NbWindowRef,
  NbWindowService,
} from "@nebular/theme";
import { saveAs } from "file-saver";
import { of, Subject } from "rxjs";
import {
  catchError,
  finalize,
  mergeMap,
  takeUntil,
  toArray,
} from "rxjs/operators";
import * as XLSX from "xlsx";
import { General } from "../../../../comun/clases/general";
import { BaseFiltroComponent } from "../../../../comun/componentes/base-filtro/base-filtro.component";
import { PaginacionComponent } from "../../../../comun/componentes/paginacion/paginacion.component";
import { SoloNumerosDirective } from "../../../../comun/directivas/solo-numeros.directive";
import { GuiaService } from "../../servicios/guia.service";
import { mapeo } from "../../servicios/mapeo";
import { DescargarArchivosService } from "@/comun/servicios/descargar-archivos.service";

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
    SoloNumerosDirective,
    PaginacionComponent,
    NbCheckboxModule,
    ReactiveFormsModule,
    NbButtonGroupModule,
  ],
  templateUrl: "./lista.component.html",
  styleUrls: ["./lista.component.scss"],
})
export class ListaComponent extends General implements OnInit, OnDestroy {
  @ViewChild("contentTemplate") contentTemplate: TemplateRef<any>;
  @ViewChild("contentTemplateComplemento")
  contentTemplateComplemento: TemplateRef<any>;
  @ViewChild("contentTemplateConfirmarEliminar")
  contentTemplateConfirmarEliminar: TemplateRef<any>;
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  public nombreFiltro: string;

  private windowRef: NbWindowRef | null = null;
  public erroresImportar: any[] = [];

  constructor(
    private windowService: NbWindowService,
    private guiaService: GuiaService,
    private directionsService: MapDirectionsService,
    private menuService: NbMenuService,
    private _archivosService: DescargarArchivosService
  ) {
    super();
  }

  importarRegistrosFormulario: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  eliminandoRegistros: boolean = false;
  numeroDeRegistrosAImportar: number = 1;
  estaImportandoComplementos: boolean = false;
  items = [{ title: "Por excel" }, { title: "Por complemento" }];
  acciones = [{ title: "Eliminar" }, { title: "Eliminar todos" }];
  formularioComplementos: FormGroup;
  selectedFile: File | null = null;
  base64File: string | null = null;
  fileName: string = "";
  cantidadRegistros: number;
  arrParametrosConsulta: ParametrosConsulta = {
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

  // eliminar
  isCheckedSeleccionarTodos: boolean = false;
  registrosAEliminar: number[] = [];
  arrProgramacionDetalle: any[] = [];

  ngOnInit() {
    this.nombreFiltro = "visita_undefined";
    this.construirFiltros();
    this.consultaLista(this.arrParametrosConsulta);
    this.inicializarFormulario();
    this.inicializarFormularioComplementos();
    this.encabezados = mapeo.datos.filter(
      (titulo) => titulo.visibleTabla === true
    );

    // menu
    this.menuService
      .onItemClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe((evento) => {
        switch (evento.item.title) {
          case "Por excel":
            this._limpiarImportarExcel();
            this.windowRef = this.windowService.open(this.contentTemplate, {
              title: "Importar excel",
            });
            break;
          case "Por complemento":
            this.windowRef = this.windowService.open(
              this.contentTemplateComplemento,
              {
                title: "Importar complemento",
              }
            );
            break;
          case "Eliminar":
            this.eliminarRegistros();
            break;
          case "Eliminar todos":
            this.windowRef = this.windowService.open(
              this.contentTemplateConfirmarEliminar,
              {
                title: "Eliminar todos los registros",
              }
            );
            break;
        }
      });
  }

  private _limpiarImportarExcel() {
    this.erroresImportar = [];
    this.selectedFile = null;
    this.base64File = null;
    this.fileName = "";
    this.changeDetectorRef.detectChanges();
  }

  construirFiltros() {
    const filtroGuardado = localStorage.getItem(this.nombreFiltro);
    if (filtroGuardado !== null) {
      const filtros = JSON.parse(filtroGuardado);
      console.log(...filtros);
      this.arrParametrosConsulta.filtros = [...filtros];
    }
  }

  inicializarFormularioComplementos() {
    this.formularioComplementos = new FormGroup(
      {
        numeroRegistros: new FormControl(
          1,
          Validators.compose([Validators.required])
        ),
        desde: new FormControl(1, Validators.compose([Validators.required])),
        hasta: new FormControl(1, Validators.compose([Validators.required])),
        pendienteDespacho: new FormControl(false),
      },
      { validators: this.validarRango() }
    );
  }

  inicializarFormulario() {
    this.formularioComplementos = new FormGroup({
      registros: new FormControl(1),
    });
    this.changeDetectorRef.detectChanges();
  }

  recibirPaginacion(event: { desplazamiento: number; limite: number }) {
    this.arrParametrosConsulta = {
      ...this.arrParametrosConsulta,
      desplazar: event.desplazamiento,
      limite: event.limite,
    };
    this.consultaLista(this.arrParametrosConsulta);
  }

  consultaLista(filtros: any) {
    this.isCheckedSeleccionarTodos = false;
    this.registrosAEliminar = [];
    this.guiaService.lista(filtros).subscribe((respuesta) => {
      this.arrGuia = respuesta.map((guia) => ({
        ...guia,
        selected: false,
      }));
      this.cantidadRegistros = respuesta?.length;
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
      this.consultaLista(this.arrParametrosConsulta);
      this.alerta.mensajaExitoso(
        "Se ha decodificado correctamente",
        "Guardado con éxito."
      );
    });
  }

  ordenar() {
    this.guiaService.ordenar().subscribe((respuesta: any) => {
      this.arrGuiasOrdenadas = respuesta.visitas_ordenadas;
      this.consultaLista(this.arrParametrosConsulta);
      this.alerta.mensajaExitoso(
        "Se ha ordenado correctamente",
        "Guardado con éxito."
      );
    });
  }

  cerrarModalComplemento() {
    this.reiniciarFormulario();
    this.cerrarModal();
    this.changeDetectorRef.detectChanges();
  }

  importarComplemento() {
    this.estaImportandoComplementos = true;
    const desde = this.transformarAPositivoMayorCero(
      this.formularioComplementos.get("desde")?.value
    );
    const hasta = this.transformarAPositivoMayorCero(
      this.formularioComplementos.get("hasta")?.value
    );
    const pendienteDespacho =
      this.formularioComplementos.get("pendienteDespacho")?.value;
    const numeroRegistros = this.transformarAPositivoMayorCero(
      this.formularioComplementos.get("numeroRegistros")?.value
    );
    this.guiaService
      .importarComplementos({
        numeroRegistros,
        desde,
        hasta,
        pendienteDespacho,
      })
      .pipe(
        finalize(() => {
          this.estaImportandoComplementos = false;
          this.numeroDeRegistrosAImportar = 1;
          this.reiniciarFormulario();
        })
      )
      .subscribe((respuesta: { mensaje: string }) => {
        this.consultaLista(this.arrParametrosConsulta);
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

  private _adaptarErroresImportar(errores: any[]) {
    of(...errores)
      .pipe(
        mergeMap((errorItem) =>
          of(
            ...Object.entries(errorItem.errores).map(
              ([campo, mensajes]: any) => ({
                fila: errorItem.fila,
                campo: campo,
                error: mensajes.join(", "),
              })
            )
          )
        ),
        toArray() // Agrupa todas las emisiones en un solo array
      )
      .subscribe((result) => {
        this.erroresImportar = result;
      });
  }

  uploadFile() {
    if (this.base64File) {
      this.guiaService
        .importarVisitas({ archivo_base64: this.base64File })
        .pipe(
          catchError((err) => {
            if (err.errores_validador) {
              this._adaptarErroresImportar(err.errores_validador);
            }

            return err;
          })
        )
        .subscribe((response) => {
          this.consultaLista(this.arrParametrosConsulta);
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

  // eliminar
  agregarRegistrosEliminar(id: number) {
    // Busca el índice del registro en el array de registros a eliminar
    const index = this.registrosAEliminar.indexOf(id);
    // Si el registro ya está en el array, lo elimina
    if (index !== -1) {
      this.registrosAEliminar.splice(index, 1);
    } else {
      // Si el registro no está en el array, lo agrega
      this.registrosAEliminar.push(id);
    }
  }

  eliminarRegistros() {
    if (this.registrosAEliminar.length > 0) {
      this.registrosAEliminar.forEach((id) => {
        this.guiaService
          .eliminarGuia(id)
          .pipe(
            finalize(() => {
              this.isCheckedSeleccionarTodos = false;
            })
          )
          .subscribe(() => {
            this.alerta.mensajaExitoso(
              "Se han eliminado los regsitros correctamente.",
              "Eliminado con éxito."
            );
            this.consultaLista(this.arrParametrosConsulta);
          });
      });
    } else {
      this.alerta.mensajeError(
        "No se han seleccionado registros para eliminar",
        "Error"
      );
    }

    this.registrosAEliminar = [];

    this.changeDetectorRef.detectChanges();
  }

  eliminarTodosLosRegistros() {
    if (this.arrGuia.length > 0) {
      this.eliminandoRegistros = true;
      this.guiaService
        .eliminarTodosLasGuias()
        .pipe(
          finalize(() => {
            this.eliminandoRegistros = false;
            this.isCheckedSeleccionarTodos = false;
            this.windowRef.close();
          })
        )
        .subscribe(() => {
          this.alerta.mensajaExitoso(
            "Se han eliminado los regsitros correctamente.",
            "Eliminado con éxito."
          );
          this.consultaLista(this.arrParametrosConsulta);
        });
    } else {
      this.windowRef.close();
      this.alerta.mensajeError(
        "No se han seleccionado registros para eliminar",
        "Error"
      );
    }
  }

  toggleSelectAll(event: Event) {
    const seleccionarTodos = event.target as HTMLInputElement;
    this.isCheckedSeleccionarTodos = !this.isCheckedSeleccionarTodos;
    // Itera sobre todos los datos
    if (seleccionarTodos.checked) {
      this.arrGuia.forEach((item: any) => {
        // Establece el estado de selección de cada registro
        item.selected = !item.selected;
        // Busca el índice del registro en el array de registros a eliminar
        const index = this.registrosAEliminar.indexOf(item.id);
        // Si el registro ya estaba en el array de registros a eliminar, lo elimina
        if (index === -1) {
          this.registrosAEliminar.push(item.id);
        } // Si el registro no estaba en el array de registros a eliminar, lo agrega
      });
    } else {
      this.arrGuia.forEach((item: any) => {
        // Establece el estado de selección de cada registro
        item.selected = !item.selected;
      });

      this.registrosAEliminar = [];
    }

    this.changeDetectorRef.detectChanges();
  }

  cerrarModal() {
    this.windowRef.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  reiniciarFormulario() {
    this.formularioComplementos.reset({
      numeroRegistros: 1,
      desde: 1,
      hasta: 1,
      pendienteDespacho: false,
    });
  }

  validarRango(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const desde = formGroup.get("desde")?.value;
      const hasta = formGroup.get("hasta")?.value;

      // Si "hasta" es menor que "desde", retorna el error
      return hasta < desde ? { rangoInvalido: true } : null;
    };
  }

  obtenerFiltros(filtros: any) {
    if (filtros.length >= 1) {
      this.arrParametrosConsulta.filtros = filtros;
    } else {
      this.arrParametrosConsulta.filtros = [];
    }

    this.changeDetectorRef.detectChanges();
    this.consultaLista(this.arrParametrosConsulta);
  }

  descargarExcelErroresImportar() {
    const nombreArchivo = "errores";
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.erroresImportar
    );
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data: Blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, nombreArchivo); // Nombre del archivo Excel a descargar
  }

  descargarEjemploExcelImportar() {
    this._archivosService.descargarArchivoLocal(
      "assets/ejemplos/modelo/estructuraVisita.xlsx",
      "estructuraVisita"
    );
  }
}
