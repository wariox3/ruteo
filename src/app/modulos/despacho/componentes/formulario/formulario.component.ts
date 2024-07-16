import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import { General } from "../../../../comun/clases/general";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbToggleModule,
} from "@nebular/theme";
import { Observable, asyncScheduler, of, zip } from "rxjs";
import { DevuelveDigitoVerificacionService } from "../../../../comun/servicios/devuelve-digito-verificacion.service";
import { map, tap, throttleTime } from "rxjs/operators";
import { RouterModule } from "@angular/router";
import { GuiaService } from "../../servicios/despacho.service";

@Component({
  selector: "app-formulario",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSelectModule,
    NbAutocompleteModule,
    NbCardModule,
    RouterModule,
    NbButtonModule,
    NbIconModule,
    NbToggleModule,
    NbDatepickerModule,
  ],
  templateUrl: "./formulario.component.html",
  styleUrls: ["./formulario.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioComponent extends General implements OnChanges {
  @Input() visualizarBtnAtras: boolean = true;
  @Input() informacionGuia: any = {};
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();



  formularioGuia = new FormGroup({
    fecha: new FormControl(this.informacionGuia.fecha),
    documento: new FormControl(this.informacionGuia.documento),
    destinatario: new FormControl(this.informacionGuia.destinatario),
    destinatario_direccion: new FormControl(
      this.informacionGuia.destinatario_direccion
    ),
    destinatario_telefono: new FormControl(
      this.informacionGuia.destinatario_telefono
    ),
    destinatario_correo: new FormControl(
      this.informacionGuia.destinatario_correo
    ),
    peso: new FormControl(this.informacionGuia.peso),
    volumen: new FormControl(this.informacionGuia.volumen),
    latitud: new FormControl(this.informacionGuia.latitud),
    longitud: new FormControl(this.informacionGuia.longitud),
    decodificado: new FormControl(this.informacionGuia.decodificado),
  });


  ngOnChanges(changes: SimpleChanges) {
    if(changes.informacionGuia.currentValue){
      this.formularioGuia.patchValue({
        fecha: this.informacionGuia.fecha,
        documento:this.informacionGuia.documento,
        destinatario: this.informacionGuia.destinatario,
        destinatario_direccion: this.informacionGuia.destinatario_direccion,
        destinatario_telefono: this.informacionGuia.destinatario_telefono,
        destinatario_correo: this.informacionGuia.destinatario_correo,
        peso: this.informacionGuia.peso,
        volumen: this.informacionGuia.volumen,
        latitud: this.informacionGuia.latitud,
        longitud: this.informacionGuia.longitud,
        decodificado: this.informacionGuia.decodificado,
      })
    }

  }

  enviar() {
    if (this.formularioGuia.valid) {
      return this.dataFormulario.emit(this.formularioGuia.value);
    } else {
      this.formularioGuia.markAllAsTouched();
    }
  }

}
