import { AsyncPipe, CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from "@angular/core";
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { GoogleMapsModule } from "@angular/google-maps";
import { RouterModule } from "@angular/router";
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbWindowRef,
  NbWindowService,
} from "@nebular/theme";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { General } from "../../../../comun/clases/general";
import { BaseFiltroComponent } from "../../../../comun/componentes/base-filtro/base-filtro.component";
import { TablaComponent } from "../../../../comun/componentes/tabla/tabla.component";
import { KeysPipe } from "../../../../comun/pipe/keys.pipe";
import { Franja } from "../../../../interfaces/franja/franja.interface";
import { mapeo } from "../../mapeo";
import { franjaService } from "../../servicios/vehiculo.service";

@Component({
  selector: "app-lista",
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    BaseFiltroComponent,
    TablaComponent,
    RouterModule,
    NbButtonModule,
    KeysPipe,
    NbIconModule,
    GoogleMapsModule,
    AsyncPipe,
    NbInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./lista.component.html",
  styleUrls: ["./lista.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaComponent extends General implements OnInit {
  @ViewChild("contentTemplate") contentTemplate: TemplateRef<any>;
  @ViewChild("editarFranja") editarFranja: TemplateRef<any>;
  @ViewChild("eliminarFranjaTemplate") eliminarFranjaTemplate: TemplateRef<any>;
  center: google.maps.LatLngLiteral = {
    lat: 6.200713725811437,
    lng: -75.58609508555918,
  };
  zoom = 12;
  markerPositions: google.maps.LatLngLiteral[] = [];
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 3,
    editable: true,
    draggable: true,
  };
  arrParametrosConsulta: any = {
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: "RutFranja",
  };
  cantidad_registros!: number;
  arrItems: any[];
  encabezados: any[];
  nuevaVertice: google.maps.LatLngLiteral[] = [];
  franjas$: Observable<Franja[]>;
  franjasTotales: number;
  estaCreando: boolean = false;
  franjaSeleccionada: any;
  selectedFile: File | null = null;
  base64Data: string | null = null;
  windowRef: NbWindowRef;

  formularioFranja: FormGroup;

  private franjaService = inject(franjaService);
  private windowService = inject(NbWindowService);

  constructor() {
    super();
    this.formularioFranja = new FormGroup({
      id: new FormControl("", Validators.compose([Validators.required])),
      codigo: new FormControl("", Validators.compose([Validators.required])),
      color: new FormControl(""),
      nombre: new FormControl("", Validators.compose([Validators.required])),
      coordenadas: new FormArray([]),
    });
  }

  ngOnInit() {
    this.consultarLista();
    this.consultarFranjas();
    this.encabezados = mapeo.datos.filter(
      (titulo) => titulo.visibleTabla === true
    );
    this.changeDetectorRef.detectChanges();
  }

  abrirModal() {
    this.windowRef = this.windowService.open(this.contentTemplate, {
      title: "Importar franjas",
    });
  }

  consultarFranjas() {
    this.franjas$ = this.franjaService.consultarFranjas().pipe(
      tap((respuesta) => {
        this.franjasTotales = respuesta.length;
      })
    );
  }

  consultarLista() {
    this.franjaService
      .lista(this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.cantidad_registros;
        this.arrItems = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  detalleEmpresa(franja_id: Number) {
    this.router.navigate([`/administracion/franja/detalle/${franja_id}`]);
  }

  editarVehiculo(franja_id: Number) {
    this.router.navigate([`/administracion/franja/editar/`, franja_id]);
  }

  addMarker(position: google.maps.LatLngLiteral) {
    this.markerPositions.push(position);
  }

  actualizarFranja() {
    const franjaId = this.formularioFranja.get("id")?.value;
    this.franjaService
      .actualizarFranja(franjaId, this.formularioFranja.value)
      .subscribe((respuesta) => {
        this.windowRef.close();
        this.alerta.mensajaExitoso(
          "Se ha actualizado la franja exitosamente.",
          "Guardado con éxito."
        );
        this.consultarLista();
        this.consultarFranjas();
      });
  }

  abrirModalConfirmacionEliminar(franja: any) {
    this.windowRef = this.windowService.open(this.eliminarFranjaTemplate, {
      title: `Eliminar franja ${franja.nombre}`,
      context: {
        franja,
      },
    });
  }

  eliminarFranja(item: any) {
    this.franjaService.eliminarFranja(item.id).subscribe(() => {
      this.alerta.mensajaExitoso(
        "Se ha eliminado la franja exitosamente.",
        "Guardado con éxito."
      );
      this.windowRef.close();
      this.consultarLista();
      this.consultarFranjas();
    });
  }

  clickMap(evento: any) {
    const coordenadasFormArray = this.formularioFranja.get(
      "coordenadas"
    ) as FormArray;

    if (this.estaCreando) {
      this.nuevaVertice = [...this.nuevaVertice, evento.latLng.toJSON()];

      this.nuevaVertice.forEach((vertex) => {
        coordenadasFormArray.push(new FormControl(vertex));
      });
    }

    if (this.nuevaVertice.length === 3 && this.estaCreando) {
      this.formularioFranja.patchValue({
        codigo: `franja-${this.franjasTotales + 1}`,
        nombre: `franja-${this.franjasTotales + 1}`,
        color: '4d25a8f9'
      });

      this.franjaService
        .guardarFranja(this.formularioFranja.value)
        .subscribe((respuesta: any) => {
          this.alerta.mensajaExitoso(
            "Se ha creado franja exitosamente.",
            "Guardado con éxito."
          );
          this.consultarLista();
          this.consultarFranjas();
          this.estaCreando = false;
          this.nuevaVertice = [];
          coordenadasFormArray.clear();
          this.changeDetectorRef.detectChanges();
        });
    }
  }

  seleccionarFranja(item: any) {
    this.franjaSeleccionada = item;
    const coordenadasArray = this.formularioFranja.get(
      "coordenadas"
    ) as FormArray;
    coordenadasArray.clear();

    this.formularioFranja.patchValue({
      codigo: item.codigo,
      id: item.id,
      color: item.color,
      nombre: item.nombre,
    });

    item.coordenadas.forEach((coordenada: any) => {
      coordenadasArray.push(new FormControl(coordenada));
    });

    this.changeDetectorRef.detectChanges();

    this.windowRef = this.windowService.open(this.editarFranja, {
      title: "Editar franja",
      context: {
        franja: "item",
      },
    });
  }

  cerrarModal() {
    this.windowRef.close()
  }

  toggleEstaCreando() {
    this.estaCreando = !this.estaCreando;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async toBase64(file: File) {
    try {
      const reader = new FileReader();
      const base64ConMetadatos: any = await new Promise((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

      return base64ConMetadatos.split(",")[1];
    } catch (error) {
      throw new Error("Error al convertir el archivo a base64");
    }
  }

  async subirArchivo() {
    const archivoEnBase64 = await this.toBase64(this.selectedFile);

    this.franjaService
      .importarArchivoKML(archivoEnBase64)
      .subscribe((respuesta) => {
        this.consultarLista();
        this.consultarFranjas();
        this.alerta.mensajaExitoso(
          "Se han importado las franjas exitosamente.",
          "Guardado con éxito."
        );
        this.windowRef.close();
        this.changeDetectorRef.detectChanges();
      });
  }
}
