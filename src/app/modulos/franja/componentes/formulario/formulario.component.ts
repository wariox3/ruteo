import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
} from "@nebular/theme";
import { VehicleMapComponent } from "../../../../comun/componentes/vehicle-map/vehicle-map.component";
import { RouterModule } from "@angular/router";
import { General } from "../../../../comun/clases/general";
import { GoogleMapsModule, MapInfoWindow,  } from "@angular/google-maps";

@Component({
  selector: "app-formulario",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbCardModule,
    VehicleMapComponent,
    RouterModule,
    NbIconModule,
    NbButtonModule,
    GoogleMapsModule
  ],
  templateUrl: "./formulario.component.html",
  styleUrls: ["./formulario.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioComponent extends General implements OnChanges{
  @Input() informacionFranja: any;
  @Input() visualizarBtnAtras: boolean = true;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();
  @ViewChild("autoInput") input;
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

  arrParametrosConsulta: any = {
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: "RutVehiculo",
  };


  formularioFranja = new FormGroup({
    codigo: new FormControl(
      '',
      Validators.compose([
        Validators.required,
      ])
    ),
    nombre: new FormControl(
      '',
      Validators.compose([
        Validators.required,
      ])
    ),
    coordenadas: new FormArray([])
  });

  ngOnChanges(changes: SimpleChanges) {

    if(changes.informacionVehiculo.currentValue){
      this.formularioFranja.patchValue({
        nombre : this.informacionFranja.nombre,
        coordenadas: this.informacionFranja.coordenadas
      })
    }

  }

  enviar() {
    if (this.formularioFranja.valid) {
      return this.dataFormulario.emit(this.formularioFranja.value);
    } else {
      this.formularioFranja.markAllAsTouched();
    }
  }

  clickMap(evento: any) {
    this.vertices = [...this.vertices, evento.latLng.toJSON()];

    const coordenadasFormArray = this.formularioFranja.get('coordenadas') as FormArray;


    coordenadasFormArray.clear();

    this.vertices.forEach(vertex => {
      coordenadasFormArray.push(new FormControl(vertex));
    });

    // this.formularioFranja.patchValue({
    //   coordenadas: this.vertices
    // })
    this.changeDetectorRef.detectChanges()
  }
}
