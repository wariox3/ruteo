import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NbResetPasswordComponent } from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { AuthService } from '../../servicios/auth.service';
import { AlertaService } from '../../../../comun/servicios/alerta.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
    NbAlertModule,
    RouterModule
  ],
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecuperarComponent extends NbResetPasswordComponent {

  private authService = inject(AuthService);
  private alerta = inject(AlertaService)

  formulario = new FormGroup({
    email: new FormControl('', Validators.required)
  })

  recuperar(){
    const emailValue = this.formulario.get('email').value;
    this.authService.recuperarClave(emailValue ).subscribe(
      (resultado: any) => {
        if (resultado.verificacion) {
          this.alerta.mensajaExitoso('Hemos enviado un enlace al correo electrónico para restablecer tu contraseña .', 'Solicitud exitosa.')
          this.router.navigate(['auth/login']);
        }
      },
    )
  }
  
 }
