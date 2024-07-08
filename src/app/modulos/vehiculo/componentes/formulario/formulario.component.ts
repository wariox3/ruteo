import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import {
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
  ],
  templateUrl: "./formulario.component.html",
  styleUrls: ["./formulario.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioComponent {
  @Input() informacionVehiculo: any = [];

  @Input() visualizarBtnAtras: boolean = true;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();
  @ViewChild("autoInput") input;

  formularioVehiculo = new FormGroup({
    placa: new FormControl(
      this.informacionVehiculo.placa,
      Validators.compose([Validators.required])
    ),
    capacidad: new FormControl(
      this.informacionVehiculo.capacidad,
      Validators.compose([Validators.required])
    ),
  });

  enviar() {
    if (this.formularioVehiculo.valid) {
      return this.dataFormulario.emit(this.formularioVehiculo.value);
    } else {
      this.formularioVehiculo.markAllAsTouched();
    }
  }
}
