import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbLoginComponent } from '@nebular/auth';
import { NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule } from '@nebular/theme';
import { TokenService } from '../../servicios/token.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
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
export class NgxLoginComponent extends NbLoginComponent {

  private tokenService = inject(TokenService);
  private authService = inject(AuthService);

  formulario = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)]))
  })

  enviar(){
    this.authService.login(this.formulario.value).subscribe(
      (resultado: any) => {
        if (resultado.token) {
          let calcularTiempo = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );
          this.tokenService.guardar(resultado.token, calcularTiempo)
          this.router.navigate(['/dashboard']);
        }
      }
    );
  }

}