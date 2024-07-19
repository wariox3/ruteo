import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
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
  NbToggleModule,
} from "@nebular/theme";
import { VehicleMapComponent } from "../../../../comun/componentes/vehicle-map/vehicle-map.component";
import { RouterModule } from "@angular/router";
import { General } from "../../../../comun/clases/general";

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
    NbToggleModule,
  ],
  templateUrl: "./formulario.component.html",
  styleUrls: ["./formulario.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioComponent extends General implements OnChanges {
  @Input() informacionVehiculo: any;

  @Input() visualizarBtnAtras: boolean = true;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();
  @ViewChild("autoInput") input;

  formularioVehiculo = new FormGroup({
    placa: new FormControl(
      "",
      Validators.compose([Validators.required, Validators.maxLength(6)])
    ),
    capacidad: new FormControl(
      "",
      Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])
    ),
    estado_activo: new FormControl(""),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes.informacionVehiculo.currentValue) {
      this.formularioVehiculo.patchValue({
        placa: this.informacionVehiculo.placa,
        capacidad: this.informacionVehiculo.capacidad,
        estado_activo: this.informacionVehiculo.estado_activo,
      });
    }
  }

  enviar() {
    if (this.formularioVehiculo.valid) {
      return this.dataFormulario.emit(this.formularioVehiculo.value);
    } else {
      this.formularioVehiculo.markAllAsTouched();
    }
  }
}
