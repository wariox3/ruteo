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
  FormBuilder,
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
import { NbAlertModule, NbAutocompleteModule, NbButtonModule, NbCardModule, NbInputModule, NbRadioModule, NbSelectModule } from "@nebular/theme";

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
  ],
  templateUrl: "./formulario.component.html",
  styleUrls: ["./formulario.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioComponent extends General implements OnInit {
  private contenedorService = inject(ContenedorService);
  private formBuilder = inject(FormBuilder);
  private devuelveDigitoVerificacionService = inject(
    DevuelveDigitoVerificacionService
  );

  arrPlanes: any[] = [];
  arrIdentificacion: any[];
  arrCiudades: any[] = [];
  planSeleccionado: Number = 2;
  procesando = false;
  @Input() informacionContenedor: any = [];
  @Input() visualizarCampoSubdominio: boolean = true;
  @Input() visualizarBtnAtras: boolean = true;
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
      ]),
    ), 
    plan_id: new FormControl(
      this.planSeleccionado,
      Validators.compose([Validators.required]),
    ),
    direccion: new FormControl(
      this.informacionContenedor.direccion,
      Validators.compose([Validators.required, Validators.maxLength(50)]),
    ),
    correo: new FormControl(
      this.informacionContenedor.correo,
      Validators.compose([
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
    ),
    ciudad_nombre: new FormControl(this.informacionContenedor.ciudad_nombre),
    ciudad_id: new FormControl(
      this.informacionContenedor.ciudad,
      Validators.compose([Validators.required]),
    ),
    numero_identificacion: new FormControl(
      this.informacionContenedor.numero_identificacion,
      Validators.compose([
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^[0-9]+$/),
      ]),
    ),
    digito_verificacion: new FormControl(
      this.informacionContenedor.digito_verificacion,
      Validators.compose([Validators.required, Validators.maxLength(1)]),
    ),
    identificacion_id: new FormControl(
      this.informacionContenedor.identificacion,
      Validators.compose([Validators.required]),
    ),
    telefono: new FormControl(
      this.informacionContenedor.telefono,
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[0-9]+$/),
      ]),
    ),
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.planSeleccionado =
      this.informacionContenedor.plan_id !== 0
        ? this.informacionContenedor.plan_id
        : this.planSeleccionado;
    this.consultarInformacion();
    this.consultarCiudad(null);
  }

  consultarInformacion() {
    zip(
      this.contenedorService.listaTipoIdentificacion(),
      this.contenedorService.listaPlanes()
    ).subscribe((respuesta: any) => {
      this.arrIdentificacion = respuesta[0].registros;
      this.arrPlanes = respuesta[1];
      this.changeDetectorRef.detectChanges();
    });
  }

  consultarCiudad(valor: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: "__icontains",
          propiedad: "nombre__icontains",
          valor1: valor !== null ? valor : "",
          valor2: "",
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: "ContenedorCiudad",
    };
    this.contenedorService
      .listaCiudades(arrFiltros)
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta: any) => {
          this.arrCiudades = respuesta.registros;
          this.filteredOptions$ = of(this.arrCiudades);
        })
      )
      .subscribe();
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
    if (campo === "ciudad_id") {
      if (dato === null) {
        this.formularioContenedor.get(campo)?.setValue(null);
        this.formularioContenedor.get("ciudad_nombre")?.setValue(null);
      } else {
        this.formularioContenedor.get(campo)?.setValue(dato.ciudad_id);
        this.formularioContenedor
          .get("ciudad_nombre")
          ?.setValue(dato.ciudad_nombre);
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  get formFields() {
    return this.formularioContenedor.controls;
  }

  formSubmit() {
    if (this.formularioContenedor.valid) {
      this.procesando = true;

      return this.dataFormulario.emit(this.formularioContenedor.value);
    } else {
      this.formularioContenedor.markAllAsTouched();
    }
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

  seleccionarPlan(plan_id: Number) {
    this.planSeleccionado = plan_id;
    this.changeDetectorRef.detectChanges();
  }

  calcularDigitoVerificacion() {
    let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioContenedor.get("numero_identificacion")?.value
    );
    this.formularioContenedor.patchValue({
      digito_verificacion: digito,
    });
  }

  private filter(value: string): string[] {
    let arrCiudad = this.arrCiudades.find((ciudad:any) => (
      ciudad.ciudad_nombre === value
    ))
    if(arrCiudad){
      this.formularioContenedor.patchValue({
        ciudad_id: arrCiudad?.ciudad_id,
        ciudad_nombre: arrCiudad?.ciudad_nombre,
      });
    }
    const filterValue = value?.toLowerCase();
    return this.arrCiudades.filter((optionValue) =>
      optionValue.ciudad_nombre.toLowerCase().includes(filterValue)
    );
  }

  getFilteredOptions(value: string): Observable<string[]> {
    return of(value).pipe(map((filterString) => this.filter(filterString)));
  }

  onChange() {
    this.consultarCiudad(this.input.nativeElement.value);
    this.filteredOptions$ = this.getFilteredOptions(this.input.nativeElement.value);
  }

  onSelectionChange($event) {
    this.filteredOptions$ = this.getFilteredOptions($event);
    // let arrCiudad =     this.arrCiudades.find((ciudad:any) => 
    //   (ciudad.ciudad_nombre === $event)
    // )
    // this.seleccionarCiudad(arrCiudad)

  }

  seleccionarCiudad(ciudad: any) {
    this.formularioContenedor.patchValue({
      ciudad_id: ciudad?.ciudad_id,
      ciudad_nombre: ciudad?.ciudad_nombre,
    });
  }
}
