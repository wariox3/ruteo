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
export class FormularioComponent extends General implements OnChanges{
  @Input() informacionFranja: any;

  @Input() visualizarBtnAtras: boolean = true;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();
  @ViewChild("autoInput") input;

  formularioFranja = new FormGroup({
    nombre: new FormControl(
      '',
      Validators.compose([
        Validators.required,
      ])
    ),
    coordenadas: new FormControl(
      ''
    )
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
}
