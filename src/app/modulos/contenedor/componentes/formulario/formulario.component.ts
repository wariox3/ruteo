import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from "@angular/core";
import { General } from "../../../../comun/clases/general";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ContenedorService } from "../../servicios/contenedor.service";
import { zip, asyncScheduler, Observable, of } from "rxjs";
import { DevuelveDigitoVerificacionService } from "../../../../comun/servicios/devuelve-digito-verificacion.service";
import { map, tap, throttleTime } from "rxjs/operators";
import {
  NbAlertModule,
  NbAutocompleteModule,
  NbButtonModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
} from "@nebular/theme";

@Component({
  selector: "app-formulario",
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbSelectModule,
    NbAutocompleteModule,
    NbInputModule,
    NbAlertModule,
    NbRadioModule,
    NbButtonModule,
    NbIconModule,
  ],
  templateUrl: "./formulario.component.html",
  styleUrls: ["./formulario.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioComponent extends General implements OnInit {
  private contenedorService = inject(ContenedorService);
  private devuelveDigitoVerificacionService = inject(
    DevuelveDigitoVerificacionService
  );

  arrPlanes: any[] = [];
  arrIdentificacion: any[];
  arrCiudades: any[] = [];
  planSeleccionado: Number = 2;
  procesando = false;
  nombreEmpresa = '';
  @Input() informacionContenedor: any = [];
  @Input() visualizarBtnAtras: boolean = true;
  @Input() visualizarCampoSubdominio: boolean = false;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();

  @ViewChild("autoInput") input;
  filteredOptions$: Observable<any[]>;

  formularioContenedor = new FormGroup({
    subdominio: new FormControl(
      this.informacionContenedor.subdominio,
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-z-0-9]*$/),
      ])
    ),
    nombre: new FormControl(
      this.informacionContenedor.nombre,
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100), // Se ha removido la restricción de mayúsculas
      ])
    ),
    plan_id: new FormControl(
      8
    ),
    correo: new FormControl(
      this.informacionContenedor.correo,
      Validators.compose([
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ])
    ),
    telefono: new FormControl(
      this.informacionContenedor.telefono,
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[0-9]+$/),
      ])
    ),
    reddoc: new FormControl(
      false
    ),
    ruteo: new FormControl(
      true
    ),
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    zip(
      this.contenedorService.listaPlanes()
    ).subscribe((respuesta: any) => {
      this.arrIdentificacion = respuesta[0].registros;
      this.arrPlanes = respuesta[1];
      this.changeDetectorRef.detectChanges();
    });
  }

  enviar() {
    if (this.formularioContenedor.valid) {
      this.procesando = true;

      return this.dataFormulario.emit(this.formularioContenedor.value);
    } else {
      this.formularioContenedor.markAllAsTouched();
    }
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContenedor?.markAsDirty();
    this.formularioContenedor?.markAsTouched();
    if (campo === 'subdominio') {
      if (!this.visualizarCampoSubdominio) {
        this.nombreEmpresa = this.formularioContenedor.get('nombre')!.value;
        this.nombreEmpresa = this.nombreEmpresa.replace(/ñ/gi, 'n');
        this.nombreEmpresa = this.nombreEmpresa.replace(/[^a-zA-Z0-9]/g, '');
        this.nombreEmpresa = this.nombreEmpresa
          .substring(0, 25)
          .toLocaleLowerCase();
        this.formularioContenedor.get(campo)?.setValue(this.nombreEmpresa);
        this.changeDetectorRef.detectChanges();
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  get formFields() {
    return this.formularioContenedor.controls;
  }


  cambiarTextoAMinusculas() {
    this.formFields.subdominio.setValue(
      this.formFields.subdominio.value.toLowerCase()
    );
  }

  confirmarExistencia() {
    if (this.formFields.subdominio.value !== "") {
      this.contenedorService
        .consultarNombre(this.formFields.subdominio.value)
        .subscribe(({ validar }) => {
          if (!validar) {
            this.formFields.subdominio.setErrors({ ContenedorYaExiste: true });
            this.changeDetectorRef.detectChanges();
          }
        });
    }
  }

  editarSubdominio() {
    this.visualizarCampoSubdominio = true;
    this.changeDetectorRef.detectChanges();
  }

}
