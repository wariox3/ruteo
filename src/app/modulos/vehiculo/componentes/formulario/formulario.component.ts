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
export class FormularioComponent extends General {
  @Input() informacionVehiculo: any;
  public formularioVehiculo: FormGroup;

  @Input() visualizarBtnAtras: boolean = true;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();
  @ViewChild("autoInput") input;

  constructor() {
    super();
    this._inicializarFormulario();
  }

  private _inicializarFormulario() {
    this.formularioVehiculo = new FormGroup({
      placa: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.maxLength(6)])
      ),
      capacidad: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ])
      ),
      estado_activo: new FormControl(true),
    });
  }

  enviar() {
    if (this.formularioVehiculo.valid) {
      return this.dataFormulario.emit(this.formularioVehiculo.value);
    } else {
      this.formularioVehiculo.markAllAsTouched();
    }
  }
}
