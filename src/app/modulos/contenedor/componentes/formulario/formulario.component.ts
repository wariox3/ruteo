import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { General } from '../../../../comun/clases/general';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContenedorService } from '../../servicios/contenedor.service';
import { zip, asyncScheduler } from 'rxjs';
import { DevuelveDigitoVerificacionService } from '../../../../comun/servicios/devuelve-digito-verificacion.service';
import { tap, throttleTime } from 'rxjs/operators';
import { NbSelectModule } from '@nebular/theme';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbSelectModule,
  ],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioComponent extends General implements OnInit { 

  private contenedorService = inject(ContenedorService)
  private formBuilder = inject(FormBuilder);
  private devuelveDigitoVerificacionService = inject(DevuelveDigitoVerificacionService);


  formularioContenedor: FormGroup;
  arrPlanes: any[] = [];
  arrIdentificacion: any[];
  arrCiudades: any[];
  planSeleccionado: Number = 2;
  procesando = false;
  @Input() informacionContenedor!: any;
  @Input() visualizarCampoSubdominio: boolean = true;
  @Input() visualizarBtnAtras: boolean = true;
  @Output() dataFormulario: EventEmitter<any> = new EventEmitter();

  constructor() {
    super()
  }

  ngOnInit(): void {
    this.planSeleccionado =
    this.informacionContenedor.plan_id !== 0
      ? this.informacionContenedor.plan_id
      : this.planSeleccionado;
  this.inicializarFormulario();
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

  consultarCiudad(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'nombre__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'ContenedorCiudad',
    };
    this.contenedorService
      .listaCiudades(arrFiltros)
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta: any) => {
          this.arrCiudades = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  enviar(){

  }

  inicializarFormulario() {
    this.formularioContenedor = this.formBuilder.group({
      subdominio: [
        this.informacionContenedor.subdominio,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-z-0-9]*$/),
        ]),
      ],
      nombre: [
        this.informacionContenedor.nombre,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100), // Se ha removido la restricción de mayúsculas
        ]),
      ],
      plan_id: [
        this.planSeleccionado,
        Validators.compose([Validators.required]),
      ],
      direccion: [
        this.informacionContenedor.direccion,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      correo: [
        this.informacionContenedor.correo,
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ]),
      ],
      ciudad_nombre: [this.informacionContenedor.ciudad_nombre],
      ciudad_id: [
        this.informacionContenedor.ciudad,
        Validators.compose([Validators.required]),
      ],
      numero_identificacion: [
        this.informacionContenedor.numero_identificacion,
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      digito_verificacion: [
        this.informacionContenedor.digito_verificacion,
        Validators.compose([Validators.required, Validators.maxLength(1)]),
      ],
      identificacion_id: [
        this.informacionContenedor.identificacion,
        Validators.compose([Validators.required]),
      ],
      telefono: [
        this.informacionContenedor.telefono,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
    });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContenedor?.markAsDirty();
    this.formularioContenedor?.markAsTouched();
    if (campo === 'ciudad_id') {
      if(dato === null){
        this.formularioContenedor.get(campo)?.setValue(null);
        this.formularioContenedor
          .get('ciudad_nombre')
          ?.setValue(null);
      } else {
        this.formularioContenedor.get(campo)?.setValue(dato.ciudad_id);
        this.formularioContenedor
          .get('ciudad_nombre')
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
    if (this.formFields.subdominio.value !== '') {
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
      this.formularioContenedor.get('numero_identificacion')?.value
    );
    this.formularioContenedor.patchValue({
      digito_verificacion: digito,
    });
  }
}
