import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbRegisterComponent } from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule } from '@nebular/theme';
import { AuthService } from '../../servicios/auth.service';
import {ReactiveFormsModule} from '@angular/forms';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'ngx-register',
  templateUrl: './registro.component.html',
  standalone : true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    ReactiveFormsModule
  ]
})
export class NgxRegistroComponent extends NbRegisterComponent {

  private authService = inject(AuthService);

  validarContrasena(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const clave = control.root.get('password')?.value;
      const confirmarClave = control.value;

      return clave === confirmarClave ? null : { 'clavesDiferentes': true };
    };
  }

  formulario = new FormGroup({
    email: new FormControl('', Validators.required),
    celular: new FormControl('', Validators.required),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])),
    confirmarContrasena: new FormControl('', [Validators.required, this.validarContrasena()]),
    terminoCondicion: new FormControl('', Validators.compose([Validators.requiredTrue]))
  })

  get formularioControl() {
    return this.formulario.controls;
  }

  enviar(){
    this.authService.registro(this.formulario.value).subscribe(
    resultado => {
      console.log(resultado)
    }
  )

  }



}