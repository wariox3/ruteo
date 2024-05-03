import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbRegisterComponent } from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbGlobalPhysicalPosition, NbInputModule, NbToastrService } from '@nebular/theme';
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
  private alert = inject(NbToastrService)


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

  enviar() {
    this.authService.registro(this.formulario.value).subscribe(
      (resultado: any) => {
        if (resultado.id) {
          this.router.navigate(['auth/login']);
        }
      },
      (error: any) => {
        if (error.status === 400) {
          let config = {
            status: 'danger',
            destroyByClick: true,
            duration: 5000,
            hasIcon: false,
            position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
            preventDuplicates: false,
          };
          this.alert.show(error.error.mensaje, 'Error 1', config);
          console.log(error)
          // Aquí puedes realizar acciones específicas para el error 400, como mostrar un mensaje de error al usuario
        } else {
          console.error('Ocurrió un error:', error);
          // Manejar otros errores aquí
        }
      }
    );
  }
}