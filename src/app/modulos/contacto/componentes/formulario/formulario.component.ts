import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
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
import {
  NbAutocompleteModule,
  NbCardModule,
  NbInputModule,
  NbSelectModule,
} from "@nebular/theme";
import { Observable, asyncScheduler, of, zip } from "rxjs";
import { ContactoService } from "../../servicios/contacto.service";
import { DevuelveDigitoVerificacionService } from "../../../../comun/servicios/devuelve-digito-verificacion.service";
import { map, tap, throttleTime } from "rxjs/operators";

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
  ],
  templateUrl: "./formulario.component.html",
  styleUrls: ["./formulario.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioComponent extends General implements OnInit {
  @Input() informacionContacto: any = [];

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
    identificacion_id: new FormControl(
      this.informacionContacto.identificacion,
      Validators.compose([Validators.required])
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
    ciudad_id: new FormControl(
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
  });

  arrTipoPersona = [];
  arrIdentificacion = [];
  arrRegimen = [];
  arrCiudades = [];
  arrPlazoPagos = [];

  private contactoService = inject(ContactoService);
  private devuelveDigitoVerificacionService = inject(
    DevuelveDigitoVerificacionService
  );
  @ViewChild("autoInput") input;
  filteredOptions$: Observable<any[]>;

  ngOnInit() {
    this.consultarInformacion();
    this.consultarCiudad(null);
  }

  enviar() {}

  consultarInformacion() {
    zip(
      this.contactoService.listaAutocompletar("TipoPersona"),
      this.contactoService.listaAutocompletar("Identificacion"),
      this.contactoService.listaAutocompletar("Regimen"),
      this.contactoService.listaAutocompletar("PlazoPago")
    ).subscribe((respuesta: any) => {
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
        this.formularioContacto.get("numero_identificacion")?.value
      );
      this.formularioContacto.patchValue({
        digito_verificacion: digito,
      });
    }
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
      modelo: "Ciudad",
    };
    this.contactoService
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

  private filter(value: string): string[] {
    let arrCiudad = this.arrCiudades.find(
      (ciudad: any) => ciudad.ciudad_nombre === value
    );
    if (arrCiudad) {
      this.formularioContacto.patchValue({
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
    this.filteredOptions$ = this.getFilteredOptions(
      this.input.nativeElement.value
    );
  }

  onSelectionChange($event) {
    this.filteredOptions$ = this.getFilteredOptions($event);
  }

  seleccionarCiudad(ciudad: any) {
    this.informacionContacto.patchValue({
      ciudad_id: ciudad?.ciudad_id,
      ciudad_nombre: ciudad?.ciudad_nombre,
    });
  }
}
