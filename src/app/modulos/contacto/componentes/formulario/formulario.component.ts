import { AutocompletarCiudades, AutocompletarIdentificacion, AutocompletarPlazoPagos, AutocompletarRegimen, AutocompletarTipoPersona } from "@/interfaces/comun/autocompletar.interface";
import { Contacto } from "@/interfaces/contacto/contacto.interface";
import { ParametrosConsulta } from "@/interfaces/general/general.interface";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
} from "@nebular/theme";
import { Observable, asyncScheduler, of, zip } from "rxjs";
import { map, tap, throttleTime } from "rxjs/operators";
import { General } from "../../../../comun/clases/general";
import { DevuelveDigitoVerificacionService } from "../../../../comun/servicios/devuelve-digito-verificacion.service";
import { ContactoService } from "../../servicios/contacto.service";

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
    NbIconModule
  ],
  templateUrl: "./formulario.component.html",
  styleUrls: ["./formulario.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioComponent extends General implements OnInit {
  @Input() visualizarBtnAtras: boolean = true;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();

  informacionContacto: Contacto = {
    numero_identificacion: "",
    digito_verificacion: "",
    nombre_corto: "",
    nombre1: null,
    nombre2: null,
    apellido1: null,
    apellido2: null,
    direccion: "",
    correo: "",
    ciudad: 0,
    ciudad_nombre: "",
    identificacion: "",
    telefono: "",
    celular: "",
    tipo_persona: null,
    regimen: "",
    codigo_ciuu: null,
    barrio: "",
    precio: "",
    plazo_pago: "",
    asesor: "",
  };

  formularioContacto = new FormGroup({
    tipo_persona: new FormControl(
      this.informacionContacto.tipo_persona,
      Validators.compose([Validators.required])
    ),
    numero_identificacion: new FormControl(
      this.informacionContacto.numero_identificacion,
      Validators.compose([
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^[0-9]+$/),
      ])
    ),
    digito_verificacion: new FormControl(
      this.informacionContacto.digito_verificacion,
      Validators.compose([Validators.required, Validators.maxLength(1)])
    ),
    identificacion: new FormControl(
      this.informacionContacto.identificacion,
      Validators.compose([Validators.required])
    ),
    nombre_corto: new FormControl(
      this.informacionContacto.nombre_corto,
        Validators.compose([Validators.maxLength(200)])
    ),
    nombre1: new FormControl(
      this.informacionContacto.nombre1
    ),
    nombre2: new FormControl(
      this.informacionContacto.nombre2
    ),
    apellido1: new FormControl(
      this.informacionContacto.apellido1
    ),
    apellido2: new FormControl(
      this.informacionContacto.apellido2
    ),
    telefono: new FormControl(
      this.informacionContacto.telefono,
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[0-9]+$/),
      ])
    ),
    celular: new FormControl(
      this.informacionContacto.celular,
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[0-9]+$/),
      ])
    ),
    barrio: new FormControl(this.informacionContacto.barrio),
    correo: new FormControl(this.informacionContacto.correo),
    regimen: new FormControl(
      this.informacionContacto.regimen,
      Validators.compose([Validators.required])
    ),
    codigo_ciuu: new FormControl(this.informacionContacto.codigo_ciuu),
    ciudad_nombre: new FormControl(this.informacionContacto.ciudad_nombre),
    ciudad: new FormControl(
      this.informacionContacto.ciudad,
      Validators.compose([Validators.required])
    ),
    direccion: new FormControl(
      this.informacionContacto.direccion,
      Validators.compose([Validators.required, Validators.maxLength(50)])
    ),
    plazo_pago: new FormControl(
      this.informacionContacto.plazo_pago,
      Validators.compose([Validators.required])
    ),
    precio: new FormControl(
      this.informacionContacto.precio
    ),
    asesor: new FormControl(
      this.informacionContacto.asesor
    )
  });

  arrTipoPersona: AutocompletarTipoPersona[] = [];
  arrIdentificacion: AutocompletarIdentificacion[] = [];
  arrRegimen: AutocompletarRegimen[] = [];
  arrCiudades: AutocompletarCiudades[] = [];
  arrPlazoPagos: AutocompletarPlazoPagos[] = [];

  tipoPersonaSeleccionada: number | null = null;

  private contactoService = inject(ContactoService);
  private devuelveDigitoVerificacionService = inject(
    DevuelveDigitoVerificacionService
  );
  @ViewChild("autoInput") input;
  filteredOptions$: Observable<AutocompletarCiudades[]>;

  ngOnInit() {
    this.consultarInformacion();
    this.consultarCiudad(null);
    this.formularioContacto.get('tipo_persona').valueChanges.subscribe(value => {
      this.tipoPersonaSeleccionada = value;
    }); 
  }

  enviar() {
    if (this.formularioContacto.valid) {
      if(this.formularioContacto.get('tipo_persona').value === 2){
        let nombreCorto = '';
        const nombre1 = this.formularioContacto.get('nombre1')?.value;
        const nombre2 = this.formularioContacto.get('nombre2')?.value;
        const apellido1 = this.formularioContacto.get('apellido1')?.value;
        const apellido2 = this.formularioContacto.get('apellido2')?.value;
    
        nombreCorto = `${nombre1}`;
        if (nombre2 !== null) {
          nombreCorto += ` ${nombre2}`;
        }
        nombreCorto += ` ${apellido1}`;
        if (apellido2 !== null) {
          nombreCorto += ` ${apellido2}`;
        }
    
        this.formularioContacto
          .get('nombre_corto')
          ?.patchValue(nombreCorto, { emitEvent: false });
      }

      return this.dataFormulario.emit(this.formularioContacto.value);
    } else {
      this.formularioContacto.markAllAsTouched();
    }
  }

  consultarInformacion() {
    zip(
      this.contactoService.listaAutocompletar<AutocompletarTipoPersona>("GenTipoPersona"),
      this.contactoService.listaAutocompletar<AutocompletarIdentificacion>("GenIdentificacion"),
      this.contactoService.listaAutocompletar<AutocompletarRegimen>("GenRegimen"),
      this.contactoService.listaAutocompletar<AutocompletarPlazoPagos>("GenPlazoPago")
    ).subscribe((respuesta) => {
      this.arrTipoPersona = respuesta[0].registros;
      this.arrIdentificacion = respuesta[1].registros;
      this.arrRegimen = respuesta[2].registros;
      this.arrPlazoPagos = respuesta[3].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  calcularDigitoVerificacion() {
    if (this.formularioContacto.get("numero_identificacion").value) {
      let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
        Number(this.formularioContacto.get("numero_identificacion")?.value)
      );
      this.formularioContacto.patchValue({
        digito_verificacion: digito,
      });
    }
  }

  consultarCiudad(valor: any) {
    let arrFiltros: ParametrosConsulta = {
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
      modelo: "GenCiudad",
    };

    this.contactoService
      .listaCiudades(arrFiltros)
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrCiudades = respuesta.registros
          this.filteredOptions$ = of(this.arrCiudades);
        })
      )
      .subscribe();
  }

  private filter(value: string): AutocompletarCiudades[] {
    let arrCiudad = this.arrCiudades.find(
      (ciudad: AutocompletarCiudades) => ciudad.nombre === value
    );
    if (arrCiudad) {
      this.formularioContacto.patchValue({
        ciudad: arrCiudad?.id,
        ciudad_nombre: arrCiudad?.nombre,
      });
    }
    const filterValue = value?.toLowerCase();
    return this.arrCiudades.filter((optionValue) =>
      optionValue.nombre.toLowerCase().includes(filterValue)
    );
  }

  getFilteredOptions(value: string): Observable<AutocompletarCiudades[]> {
    return of(value).pipe(map((filterString) => this.filter(filterString)));
  }

  onChange() {
    this.consultarCiudad(this.input.nativeElement.value);
    this.filteredOptions$ = this.getFilteredOptions(
      this.input.nativeElement.value
    );
  }

  onSelectionChange($event) {
    this.filteredOptions$ = this.getFilteredOptions($event);
  }

  seleccionarCiudad(ciudad: AutocompletarCiudades) {
    this.formularioContacto.patchValue({
      ciudad: ciudad?.id,
      ciudad_nombre: ciudad?.nombre,
    });
  }
}
